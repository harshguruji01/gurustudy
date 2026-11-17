package online.webguruji.gurustudy.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import online.webguruji.gurustudy.MainActivity
import online.webguruji.gurustudy.R
import online.webguruji.gurustudy.data.model.MissionEngine
import online.webguruji.gurustudy.data.repository.StudyRepository
import java.util.Calendar

class GuruStudyWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val repository = StudyRepository(context)
            val profile = repository.getUserProfile()
            val streakInfo = MissionEngine.calculateMissionStreak(profile.studyStreak)

            val views = RemoteViews(context.packageName, R.layout.widget_gurustudy)

            // Streak Pill
            views.setTextViewText(R.id.widget_streak_badge, streakInfo.profileBadgeText)

            // Remaining study hours
            val cal = Calendar.getInstance()
            val isSunday = cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY
            val dailyGoalStr = if (isSunday) "6.5 Hours Today (Sunday Boost)" else "5.0 Hours Today"
            views.setTextViewText(R.id.widget_remaining_hours, dailyGoalStr)

            // Next Alarm Time
            val defaultStartTime = repository.getDefaultStudyStartTime()
            views.setTextViewText(R.id.widget_next_alarm, "🔔 Study Alarm: $defaultStartTime")

            // Launch MainActivity when tapped
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun updateAllWidgets(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val thisWidget = ComponentName(context, GuruStudyWidget::class.java)
            val allWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget)
            for (widgetId in allWidgetIds) {
                updateAppWidget(context, appWidgetManager, widgetId)
            }
        }
    }
}
