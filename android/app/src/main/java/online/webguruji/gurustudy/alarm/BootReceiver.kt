package online.webguruji.gurustudy.alarm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import online.webguruji.gurustudy.data.repository.StudyRepository
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            val repository = StudyRepository(context)
            val scheduler = AlarmScheduler(context)
            val profile = repository.getUserProfile()
            val schedules = repository.getAllSchedules()

            val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

            for (item in schedules) {
                // If the scheduled date is today or in the future and alarm is enabled
                if (item.alarmEnabled && item.status != "Completed" && item.date >= todayStr) {
                    scheduler.scheduleStudyAlarm(item, profile.fullName.ifBlank { "Student" })
                }
            }
        }
    }
}
