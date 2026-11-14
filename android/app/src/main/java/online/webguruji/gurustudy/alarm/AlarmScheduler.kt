package online.webguruji.gurustudy.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import online.webguruji.gurustudy.data.local.PreferencesManager
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.StudySlotItem
import java.util.Calendar
import java.util.Date

class AlarmScheduler(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    private val prefs = PreferencesManager(context)

    companion object {
        const val EXTRA_DAY_INDEX = "extra_day_index"
        const val EXTRA_SLOT_INDEX = "extra_slot_index"
        const val EXTRA_STUDENT_NAME = "extra_student_name"
        const val EXTRA_SUBJECT = "extra_subject"
        const val EXTRA_CHAPTER = "extra_chapter"
        const val EXTRA_DURATION = "extra_duration"
    }

    /**
     * Schedules an exact alarm for a specific slot on a specific day.
     * Uses AlarmManager.setAlarmClock() for highest priority and Doze-mode bypass.
     */
    fun scheduleSlotAlarm(
        item: StudyScheduleItem,
        slotIndex: Int,
        studentName: String
    ) {
        val slot = item.slots.getOrNull(slotIndex)
        val timeString = when {
            slot != null && slot.scheduledTime.isNotBlank() -> slot.scheduledTime
            slot != null && slot.time.contains(":") -> {
                // Extract "06:00" from strings like "06:00 AM - 07:30 AM"
                slot.time.split("-").firstOrNull()?.trim()?.take(5) ?: prefs.getSlotAlarmTime(slotIndex)
            }
            else -> prefs.getSlotAlarmTime(slotIndex)
        }

        val subject = slot?.subject?.ifBlank { item.subject } ?: item.subject
        val chapter = slot?.topic?.ifBlank { slot.chapter.ifBlank { item.chapterTitle } } ?: item.chapterTitle
        val duration = slot?.durationMinutes ?: (item.estimatedMinutes / 4).coerceAtLeast(30)

        scheduleExactAlarm(
            dayIndex = item.dayIndex,
            slotIndex = slotIndex,
            dateStr = item.date,
            timeStr = timeString,
            studentName = studentName,
            subject = subject,
            chapter = chapter,
            duration = duration
        )
    }

    /**
     * Schedules alarms for a study day. If the day has defined slots, schedules
     * each enabled slot individually. Otherwise schedules the day's primary time.
     */
    fun scheduleStudyAlarm(item: StudyScheduleItem, studentName: String) {
        if (!item.alarmEnabled || item.status == "Completed") {
            cancelAlarm(item.dayIndex)
            return
        }

        if (item.slots.isNotEmpty()) {
            item.slots.forEachIndexed { slotIndex, slot ->
                val slotEnabled = slot.alarmEnabled && prefs.isSlotAlarmEnabled(slotIndex)
                if (slotEnabled && !slot.completed) {
                    scheduleSlotAlarm(item, slotIndex, studentName)
                } else {
                    cancelSlotAlarm(item.dayIndex, slotIndex)
                }
            }
        } else {
            // Fallback for schedule items without explicit slots
            scheduleExactAlarm(
                dayIndex = item.dayIndex,
                slotIndex = 0,
                dateStr = item.date,
                timeStr = item.scheduledTime.ifBlank { "06:00" },
                studentName = studentName,
                subject = item.subject,
                chapter = item.chapterTitle,
                duration = item.estimatedMinutes
            )
        }
    }

    private fun scheduleExactAlarm(
        dayIndex: Int,
        slotIndex: Int,
        dateStr: String,
        timeStr: String,
        studentName: String,
        subject: String,
        chapter: String,
        duration: Int
    ) {
        val calendar = Calendar.getInstance()
        val dateParts = dateStr.split("-") // YYYY-MM-DD
        val timeClean = timeStr.trim().split(" ")[0] // Handle "06:00 AM" -> "06:00"
        val timeParts = timeClean.split(":") // HH:mm

        if (dateParts.size == 3 && timeParts.size >= 2) {
            calendar.set(Calendar.YEAR, dateParts[0].toInt())
            calendar.set(Calendar.MONTH, dateParts[1].toInt() - 1)
            calendar.set(Calendar.DAY_OF_MONTH, dateParts[2].toInt())
            calendar.set(Calendar.HOUR_OF_DAY, timeParts[0].toInt())
            calendar.set(Calendar.MINUTE, timeParts[1].toInt())
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)

            val triggerTime = calendar.timeInMillis
            // If the time is in the past, don't arm
            if (triggerTime <= System.currentTimeMillis()) {
                return
            }

            val requestCode = (dayIndex * 10) + slotIndex

            val intent = Intent(context, StudyAlarmReceiver::class.java).apply {
                action = "online.webguruji.gurustudy.ACTION_STUDY_ALARM"
                putExtra(EXTRA_DAY_INDEX, dayIndex)
                putExtra(EXTRA_SLOT_INDEX, slotIndex)
                putExtra(EXTRA_STUDENT_NAME, studentName)
                putExtra(EXTRA_SUBJECT, subject)
                putExtra(EXTRA_CHAPTER, chapter)
                putExtra(EXTRA_DURATION, duration)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val showIntent = Intent(context, online.webguruji.gurustudy.MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                putExtra("NAVIGATE_TO", "STUDY_TIMER")
                putExtra("SUBJECT", subject)
                putExtra("CHAPTER", chapter)
                putExtra("DURATION", duration)
            }
            val showPendingIntent = PendingIntent.getActivity(
                context,
                requestCode,
                showIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val clockInfo = AlarmManager.AlarmClockInfo(triggerTime, showPendingIntent)

            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    if (alarmManager.canScheduleExactAlarms()) {
                        alarmManager.setAlarmClock(clockInfo, pendingIntent)
                    } else {
                        alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                    }
                } else {
                    alarmManager.setAlarmClock(clockInfo, pendingIntent)
                }
            } catch (e: SecurityException) {
                // Fallback gracefully if exact alarm permission was denied or restricted
                try {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                } catch (ex: Exception) {
                    ex.printStackTrace()
                }
            }
        }
    }

    /**
     * Schedules a Snooze alarm (default 10 minutes in the future).
     */
    fun scheduleSnoozeAlarm(
        dayIndex: Int,
        studentName: String,
        subject: String,
        chapter: String,
        duration: Int,
        slotIndex: Int = 0
    ) {
        val triggerTime = System.currentTimeMillis() + (10 * 60 * 1000L) // 10 minutes snooze
        val requestCode = (dayIndex * 10) + slotIndex + 10000

        val intent = Intent(context, StudyAlarmReceiver::class.java).apply {
            action = "online.webguruji.gurustudy.ACTION_STUDY_ALARM"
            putExtra(EXTRA_DAY_INDEX, dayIndex)
            putExtra(EXTRA_SLOT_INDEX, slotIndex)
            putExtra(EXTRA_STUDENT_NAME, studentName)
            putExtra(EXTRA_SUBJECT, subject)
            putExtra(EXTRA_CHAPTER, chapter)
            putExtra(EXTRA_DURATION, duration)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        try {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        } catch (e: SecurityException) {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        }
    }

    /**
     * Immediate/delayed test alarm for QA and student self-testing (fires in delaySeconds).
     */
    fun scheduleTestAlarm(
        studentName: String,
        subject: String,
        chapter: String,
        duration: Int = 45,
        delaySeconds: Int = 5
    ) {
        val triggerTime = System.currentTimeMillis() + (delaySeconds * 1000L)
        val requestCode = 9999

        val intent = Intent(context, StudyAlarmReceiver::class.java).apply {
            action = "online.webguruji.gurustudy.ACTION_STUDY_ALARM"
            putExtra(EXTRA_DAY_INDEX, 1)
            putExtra(EXTRA_SLOT_INDEX, 0)
            putExtra(EXTRA_STUDENT_NAME, studentName)
            putExtra(EXTRA_SUBJECT, subject)
            putExtra(EXTRA_CHAPTER, chapter)
            putExtra(EXTRA_DURATION, duration)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val showIntent = Intent(context, online.webguruji.gurustudy.MainActivity::class.java)
        val showPendingIntent = PendingIntent.getActivity(
            context,
            requestCode,
            showIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val clockInfo = AlarmManager.AlarmClockInfo(triggerTime, showPendingIntent)

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setAlarmClock(clockInfo, pendingIntent)
                } else {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                }
            } else {
                alarmManager.setAlarmClock(clockInfo, pendingIntent)
            }
        } catch (e: SecurityException) {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
        }
    }

    fun cancelSlotAlarm(dayIndex: Int, slotIndex: Int) {
        val requestCode = (dayIndex * 10) + slotIndex
        val intent = Intent(context, StudyAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
        }
    }

    fun cancelAlarm(dayIndex: Int) {
        // Cancel base requestCode
        val baseIntent = Intent(context, StudyAlarmReceiver::class.java)
        val basePending = PendingIntent.getBroadcast(
            context,
            dayIndex,
            baseIntent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (basePending != null) {
            alarmManager.cancel(basePending)
            basePending.cancel()
        }

        // Cancel all potential 4 slots for this day
        for (slotIndex in 0..3) {
            cancelSlotAlarm(dayIndex, slotIndex)
        }
    }

    /**
     * Determines the next upcoming alarm from the schedule list.
     */
    fun getNextUpcomingAlarmTime(schedules: List<StudyScheduleItem>): String? {
        val now = System.currentTimeMillis()
        val calendar = Calendar.getInstance()

        for (item in schedules) {
            if (!item.alarmEnabled || item.status == "Completed") continue
            val dateParts = item.date.split("-")
            if (dateParts.size != 3) continue

            val slots = if (item.slots.isNotEmpty()) item.slots else listOf(
                StudySlotItem(
                    subject = item.subject,
                    topic = item.chapterTitle,
                    time = item.scheduledTime
                )
            )

            for ((slotIdx, slot) in slots.withIndex()) {
                if (!slot.alarmEnabled || slot.completed) continue
                val timeStr = if (slot.scheduledTime.isNotBlank()) slot.scheduledTime else prefs.getSlotAlarmTime(slotIdx)
                val timeParts = timeStr.trim().split(" ")[0].split(":")
                if (timeParts.size < 2) continue

                calendar.set(Calendar.YEAR, dateParts[0].toInt())
                calendar.set(Calendar.MONTH, dateParts[1].toInt() - 1)
                calendar.set(Calendar.DAY_OF_MONTH, dateParts[2].toInt())
                calendar.set(Calendar.HOUR_OF_DAY, timeParts[0].toInt())
                calendar.set(Calendar.MINUTE, timeParts[1].toInt())
                calendar.set(Calendar.SECOND, 0)
                calendar.set(Calendar.MILLISECOND, 0)

                if (calendar.timeInMillis > now) {
                    return "${item.date} at $timeStr (${slot.subject})"
                }
            }
        }
        return null
    }
}
