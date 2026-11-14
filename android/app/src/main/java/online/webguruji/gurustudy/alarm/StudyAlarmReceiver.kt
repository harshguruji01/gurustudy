package online.webguruji.gurustudy.alarm

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import androidx.core.app.NotificationCompat
import online.webguruji.gurustudy.GuruStudyApp
import online.webguruji.gurustudy.MainActivity
import online.webguruji.gurustudy.R
import online.webguruji.gurustudy.data.local.PreferencesManager
import online.webguruji.gurustudy.service.FloatingStudyReminderService

class StudyAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val studentName = intent.getStringExtra(AlarmScheduler.EXTRA_STUDENT_NAME) ?: "Student"
        val subject = intent.getStringExtra(AlarmScheduler.EXTRA_SUBJECT) ?: "Mathematics"
        val chapter = intent.getStringExtra(AlarmScheduler.EXTRA_CHAPTER) ?: "Class 10 Syllabus"
        val dayIndex = intent.getIntExtra(AlarmScheduler.EXTRA_DAY_INDEX, 1)
        val slotIndex = intent.getIntExtra(AlarmScheduler.EXTRA_SLOT_INDEX, 0)
        val duration = intent.getIntExtra(AlarmScheduler.EXTRA_DURATION, 60)

        val notificationId = (dayIndex * 10) + slotIndex

        // Acquire partial WakeLock safely to ensure CPU processes alarm notification
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "GuruStudy:StudyAlarmWakeLock"
        )
        wakeLock.acquire(10000L /*10 seconds timeout*/)

        // Check and launch Floating Study Reminder if enabled and permitted
        val prefs = PreferencesManager(context)
        if (prefs.isFloatingReminderEnabled() && Settings.canDrawOverlays(context)) {
            try {
                val reminderIntent = Intent(context, FloatingStudyReminderService::class.java).apply {
                    action = FloatingStudyReminderService.ACTION_SHOW_REMINDER
                    putExtra(FloatingStudyReminderService.EXTRA_STUDENT_NAME, studentName)
                    putExtra(FloatingStudyReminderService.EXTRA_SUBJECT, subject)
                    putExtra(FloatingStudyReminderService.EXTRA_CHAPTER, chapter)
                    putExtra(FloatingStudyReminderService.EXTRA_DURATION, duration)
                    putExtra(FloatingStudyReminderService.EXTRA_DAY_INDEX, dayIndex)
                    putExtra(FloatingStudyReminderService.EXTRA_SLOT_INDEX, slotIndex)
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(reminderIntent)
                } else {
                    context.startService(reminderIntent)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // Full Screen Intent to bring up custom alarm ringing UI
        val fullScreenIntent = Intent(context, FullScreenAlarmActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(AlarmScheduler.EXTRA_STUDENT_NAME, studentName)
            putExtra(AlarmScheduler.EXTRA_SUBJECT, subject)
            putExtra(AlarmScheduler.EXTRA_CHAPTER, chapter)
            putExtra(AlarmScheduler.EXTRA_DAY_INDEX, dayIndex)
            putExtra(AlarmScheduler.EXTRA_SLOT_INDEX, slotIndex)
            putExtra(AlarmScheduler.EXTRA_DURATION, duration)
        }

        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            notificationId,
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
            ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

        val notificationTitle = "GuruStudy — Study Time, $studentName!"
        val notificationText = "$subject session is starting: $chapter ($duration mins)."

        // Action 1: Start Study
        val startStudyIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("NAVIGATE_TO", "STUDY_TIMER")
            putExtra("SUBJECT", subject)
            putExtra("CHAPTER", chapter)
            putExtra("DURATION", duration)
            putExtra("DAY_INDEX", dayIndex)
        }
        val startStudyPendingIntent = PendingIntent.getActivity(
            context,
            notificationId + 20000,
            startStudyIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Action 2: Snooze 10m
        val snoozeIntent = Intent(context, NotificationActionReceiver::class.java).apply {
            action = NotificationActionReceiver.ACTION_SNOOZE
            putExtra(AlarmScheduler.EXTRA_DAY_INDEX, dayIndex)
            putExtra(AlarmScheduler.EXTRA_SLOT_INDEX, slotIndex)
            putExtra(AlarmScheduler.EXTRA_STUDENT_NAME, studentName)
            putExtra(AlarmScheduler.EXTRA_SUBJECT, subject)
            putExtra(AlarmScheduler.EXTRA_CHAPTER, chapter)
            putExtra(AlarmScheduler.EXTRA_DURATION, duration)
        }
        val snoozePendingIntent = PendingIntent.getBroadcast(
            context,
            notificationId + 30000,
            snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Action 3: Dismiss
        val dismissIntent = Intent(context, NotificationActionReceiver::class.java).apply {
            action = NotificationActionReceiver.ACTION_DISMISS
            putExtra(AlarmScheduler.EXTRA_DAY_INDEX, dayIndex)
            putExtra(AlarmScheduler.EXTRA_SLOT_INDEX, slotIndex)
        }
        val dismissPendingIntent = PendingIntent.getBroadcast(
            context,
            notificationId + 40000,
            dismissIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notificationBuilder = NotificationCompat.Builder(context, GuruStudyApp.ALARM_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(notificationTitle)
            .setContentText(notificationText)
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("$subject session is starting.\n\nTopic: $chapter\nDuration: $duration minutes\n\nTap Start Now to begin focus timer.")
            )
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setSound(alarmSound)
            .setVibrate(longArrayOf(0, 500, 250, 500, 250, 500))
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setContentIntent(fullScreenPendingIntent)
            .addAction(R.drawable.ic_launcher_foreground, "▶ Start Now", startStudyPendingIntent)
            .addAction(R.drawable.ic_launcher_foreground, "⏰ Snooze 10m", snoozePendingIntent)
            .addAction(R.drawable.ic_launcher_foreground, "✕ Dismiss", dismissPendingIntent)

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(notificationId, notificationBuilder.build())

        // Launch the FullScreenAlarmActivity directly
        try {
            context.startActivity(fullScreenIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
