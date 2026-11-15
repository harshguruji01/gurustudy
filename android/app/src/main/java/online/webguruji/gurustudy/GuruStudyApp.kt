package online.webguruji.gurustudy

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import online.webguruji.gurustudy.data.repository.StudyRepository

class GuruStudyApp : Application() {

    companion object {
        const val ALARM_CHANNEL_ID = "study_alarms_channel"
        const val NOTIFICATION_CHANNEL_ID = "study_reminders_channel"
        const val TIMER_CHANNEL_ID = "study_timer_overlay_channel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            // High Priority Study Alarm Channel
            val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            val audioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build()

            val alarmChannel = NotificationChannel(
                ALARM_CHANNEL_ID,
                getString(R.string.alarm_channel_name),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = getString(R.string.alarm_channel_desc)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 250, 500, 250, 500)
                setSound(alarmSound, audioAttributes)
                lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
                setBypassDnd(true)
            }

            // General Reminder Channel
            val reminderChannel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Study Reminders",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Daily study progress and revision reminders"
            }

            // Floating Study Timer Channel
            val timerChannel = NotificationChannel(
                TIMER_CHANNEL_ID,
                "Floating Study Timer",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Active study timer overlay notification"
                setShowBadge(false)
            }

            notificationManager.createNotificationChannel(alarmChannel)
            notificationManager.createNotificationChannel(reminderChannel)
            notificationManager.createNotificationChannel(timerChannel)
        }
    }
}
