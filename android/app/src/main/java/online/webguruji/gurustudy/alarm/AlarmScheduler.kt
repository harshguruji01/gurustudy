package online.webguruji.gurustudy.alarm

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class AlarmScheduler(private val context: Context) {
    private val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

    companion object {
        const val EXTRA_DAY_INDEX = "extra_day_index"
        const val EXTRA_STUDENT_NAME = "extra_student_name"
        const val EXTRA_SUBJECT = "extra_subject"
        const val EXTRA_CHAPTER = "extra_chapter"
        const val EXTRA_DURATION = "extra_duration"
    }

    fun scheduleStudyAlarm(item: StudyScheduleItem, studentName: String) {
        val calendar = Calendar.getInstance()
        val dateParts = item.date.split("-") // YYYY-MM-DD
        val timeParts = item.scheduledTime.split(":") // HH:mm

        if (dateParts.size == 3 && timeParts.size == 2) {
            calendar.set(Calendar.YEAR, dateParts[0].toInt())
            calendar.set(Calendar.MONTH, dateParts[1].toInt() - 1)
            calendar.set(Calendar.DAY_OF_MONTH, dateParts[2].toInt())
            calendar.set(Calendar.HOUR_OF_DAY, timeParts[0].toInt())
            calendar.set(Calendar.MINUTE, timeParts[1].toInt())
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)

            // If the time is in the past, don't trigger immediately unless testing
            val triggerTime = calendar.timeInMillis
            if (triggerTime <= System.currentTimeMillis()) {
                return
            }

            val intent = Intent(context, StudyAlarmReceiver::class.java).apply {
                action = "online.webguruji.gurustudy.ACTION_STUDY_ALARM"
                putExtra(EXTRA_DAY_INDEX, item.dayIndex)
                putExtra(EXTRA_STUDENT_NAME, studentName)
                putExtra(EXTRA_SUBJECT, item.subject)
                putExtra(EXTRA_CHAPTER, item.chapterTitle)
                putExtra(EXTRA_DURATION, item.estimatedMinutes)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                item.dayIndex,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                } else {
                    alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
                }
            } else {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
            }
        }
    }

    fun scheduleSnoozeAlarm(dayIndex: Int, studentName: String, subject: String, chapter: String, duration: Int) {
        val triggerTime = System.currentTimeMillis() + (10 * 60 * 1000) // 10 minutes snooze

        val intent = Intent(context, StudyAlarmReceiver::class.java).apply {
            action = "online.webguruji.gurustudy.ACTION_STUDY_ALARM"
            putExtra(EXTRA_DAY_INDEX, dayIndex)
            putExtra(EXTRA_STUDENT_NAME, studentName)
            putExtra(EXTRA_SUBJECT, subject)
            putExtra(EXTRA_CHAPTER, chapter)
            putExtra(EXTRA_DURATION, duration)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            dayIndex + 10000,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerTime, pendingIntent)
    }

    fun cancelAlarm(dayIndex: Int) {
        val intent = Intent(context, StudyAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            dayIndex,
            intent,
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
        )
        if (pendingIntent != null) {
            alarmManager.cancel(pendingIntent)
            pendingIntent.cancel()
        }
    }
}
