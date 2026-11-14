package online.webguruji.gurustudy.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import online.webguruji.gurustudy.data.repository.StudyRepository
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Resilient Receiver that reschedules study alarms after:
 * 1. Device reboots (BOOT_COMPLETED, LOCKED_BOOT_COMPLETED, QUICKBOOT_POWERON)
 * 2. App package updates (MY_PACKAGE_REPLACED)
 * 3. System clock or timezone changes (TIMEZONE_CHANGED, TIME_SET)
 */
class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        val validActions = setOf(
            Intent.ACTION_BOOT_COMPLETED,
            Intent.ACTION_LOCKED_BOOT_COMPLETED,
            Intent.ACTION_MY_PACKAGE_REPLACED,
            Intent.ACTION_TIMEZONE_CHANGED,
            Intent.ACTION_TIME_CHANGED,
            "android.intent.action.QUICKBOOT_POWERON",
            "com.htc.intent.action.QUICKBOOT_POWERON"
        )

        if (action in validActions) {
            try {
                val repository = StudyRepository(context)
                val scheduler = AlarmScheduler(context)
                val profile = repository.getUserProfile()
                val schedules = repository.getAllSchedules()

                val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

                // Arm alarms for all upcoming active days
                for (item in schedules) {
                    if (item.alarmEnabled && item.status != "Completed" && item.date >= todayStr) {
                        scheduler.scheduleStudyAlarm(item, profile.fullName.ifBlank { "Student" })
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
