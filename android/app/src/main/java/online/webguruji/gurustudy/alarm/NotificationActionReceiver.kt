package online.webguruji.gurustudy.alarm

import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast
import online.webguruji.gurustudy.service.FloatingStudyReminderService

class NotificationActionReceiver : BroadcastReceiver() {

    companion object {
        const val ACTION_SNOOZE = "online.webguruji.gurustudy.ACTION_SNOOZE"
        const val ACTION_DISMISS = "online.webguruji.gurustudy.ACTION_DISMISS"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val dayIndex = intent.getIntExtra(AlarmScheduler.EXTRA_DAY_INDEX, 1)
        val slotIndex = intent.getIntExtra(AlarmScheduler.EXTRA_SLOT_INDEX, 0)
        val notificationId = (dayIndex * 10) + slotIndex

        // Stop Floating Reminder if running
        try {
            val stopReminderIntent = Intent(context, FloatingStudyReminderService::class.java).apply {
                action = FloatingStudyReminderService.ACTION_DISMISS_REMINDER
            }
            context.startService(stopReminderIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }

        when (intent.action) {
            ACTION_SNOOZE -> {
                val studentName = intent.getStringExtra(AlarmScheduler.EXTRA_STUDENT_NAME) ?: "Student"
                val subject = intent.getStringExtra(AlarmScheduler.EXTRA_SUBJECT) ?: "Mathematics"
                val chapter = intent.getStringExtra(AlarmScheduler.EXTRA_CHAPTER) ?: "Real Numbers"
                val duration = intent.getIntExtra(AlarmScheduler.EXTRA_DURATION, 45)

                notificationManager.cancel(notificationId)
                notificationManager.cancel(dayIndex) // Fallback cancel

                AlarmScheduler(context).scheduleSnoozeAlarm(
                    dayIndex = dayIndex,
                    studentName = studentName,
                    subject = subject,
                    chapter = chapter,
                    duration = duration,
                    slotIndex = slotIndex
                )
                Toast.makeText(context, "⏰ Study alarm snoozed for 10 minutes", Toast.LENGTH_SHORT).show()
            }
            ACTION_DISMISS -> {
                notificationManager.cancel(notificationId)
                notificationManager.cancel(dayIndex) // Fallback cancel
            }
        }
    }
}
