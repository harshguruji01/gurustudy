package online.webguruji.gurustudy.alarm

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import online.webguruji.gurustudy.GuruStudyApp
import online.webguruji.gurustudy.R

class StudyAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val studentName = intent.getStringExtra(AlarmScheduler.EXTRA_STUDENT_NAME) ?: "Student"
        val subject = intent.getStringExtra(AlarmScheduler.EXTRA_SUBJECT) ?: "Class 10 Subject"
        val chapter = intent.getStringExtra(AlarmScheduler.EXTRA_CHAPTER) ?: "NCERT Chapter"
        val dayIndex = intent.getIntExtra(AlarmScheduler.EXTRA_DAY_INDEX, 1)
        val duration = intent.getIntExtra(AlarmScheduler.EXTRA_DURATION, 60)

        // Acquire WakeLock safely to turn on screen
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = powerManager.newWakeLock(
            PowerManager.FULL_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP or PowerManager.ON_AFTER_RELEASE,
            "GuruStudy:StudyAlarmWakeLock"
        )
        wakeLock.acquire(10 * 1000L /*10 seconds*/)

        // Full Screen Intent to bring up custom alarm ringing UI
        val fullScreenIntent = Intent(context, FullScreenAlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(AlarmScheduler.EXTRA_STUDENT_NAME, studentName)
            putExtra(AlarmScheduler.EXTRA_SUBJECT, subject)
            putExtra(AlarmScheduler.EXTRA_CHAPTER, chapter)
            putExtra(AlarmScheduler.EXTRA_DAY_INDEX, dayIndex)
            putExtra(AlarmScheduler.EXTRA_DURATION, duration)
        }

        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            dayIndex,
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val notificationTitle = "$studentName, Study Time on GuruStudy!"
        val notificationText = "It’s time to study $subject: $chapter ($duration mins)."

        val notificationBuilder = NotificationCompat.Builder(context, GuruStudyApp.ALARM_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(notificationTitle)
            .setContentText(notificationText)
            .setStyle(NotificationCompat.BigTextStyle().bigText(notificationText))
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setSound(alarmSound)
            .setVibrate(longArrayOf(0, 500, 250, 500, 250, 500))
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setContentIntent(fullScreenPendingIntent)

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(dayIndex, notificationBuilder.build())

        // Also start the FullScreenAlarmActivity directly
        try {
            context.startActivity(fullScreenIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
