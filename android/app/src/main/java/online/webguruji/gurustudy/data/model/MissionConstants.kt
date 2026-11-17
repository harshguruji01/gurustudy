package online.webguruji.gurustudy.data.model

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Strict Mission Date Constants & Engine for GuruStudy
 * Official Streak & Mission Window: 20 November 2026 to 15 February 2027 (88 Days)
 */
object MissionConstants {
    const val MISSION_START_DATE = "2026-11-20"
    const val MISSION_END_DATE = "2027-02-15"
    const val TOTAL_MISSION_DAYS = 88
}

enum class MissionPhaseState {
    BEFORE_MISSION,
    ACTIVE_MISSION,
    COMPLETED_MISSION
}

data class MissionStreakInfo(
    val streakDays: Int,
    val totalMissionDays: Int = 88,
    val phaseState: MissionPhaseState,
    val profileBadgeText: String,
    val homeHeaderText: String,
    val daysUntilStart: Int = 0,
    val daysElapsed: Int = 0,
    val daysRemaining: Int = 88,
    val isWarmupMode: Boolean = false
)

object MissionEngine {
    /**
     * Three-State Streak Calculation Engine:
     * 1. Before 20 Nov 2026: Streak is 0d, shows "⏳ Starts 20 Nov", allows warm-up/preview mode.
     * 2. Active Window (20 Nov 2026 - 15 Feb 2027): Starts counting from Day 1 (20 Nov), shows "🔥 Xd / 88d Streak".
     * 3. After 15 Feb 2027: Locked on 15 Feb 2027, shows "🏆 Mission Completed • Final Streak: Xd / 88d".
     */
    fun calculateMissionStreak(userStreak: Int = 0): MissionStreakInfo {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val todayStr = sdf.format(Date())
        val todayDate = sdf.parse(todayStr) ?: Date()
        val startDate = sdf.parse(MissionConstants.MISSION_START_DATE) ?: Date()
        val endDate = sdf.parse(MissionConstants.MISSION_END_DATE) ?: Date()

        return when {
            todayDate.before(startDate) -> {
                val diffMs = startDate.time - todayDate.time
                val diffDays = ((diffMs + 1000 * 60 * 60 * 12) / (1000 * 60 * 60 * 24)).toInt().coerceAtLeast(1)
                val badgeText = "⏳ Starts 20 Nov"
                val homeHeader = if (diffDays <= 1) "Starts Tomorrow (20 Nov)" else "Starts in $diffDays Days (20 Nov)"
                MissionStreakInfo(
                    streakDays = 0,
                    totalMissionDays = MissionConstants.TOTAL_MISSION_DAYS,
                    phaseState = MissionPhaseState.BEFORE_MISSION,
                    profileBadgeText = badgeText,
                    homeHeaderText = homeHeader,
                    daysUntilStart = diffDays,
                    daysElapsed = 0,
                    daysRemaining = MissionConstants.TOTAL_MISSION_DAYS,
                    isWarmupMode = true
                )
            }
            todayDate.after(endDate) -> {
                val finalStreak = userStreak.coerceIn(0, MissionConstants.TOTAL_MISSION_DAYS)
                val badgeText = "🏆 Mission Completed • Final Streak: ${finalStreak}d / 88d"
                MissionStreakInfo(
                    streakDays = finalStreak,
                    totalMissionDays = MissionConstants.TOTAL_MISSION_DAYS,
                    phaseState = MissionPhaseState.COMPLETED_MISSION,
                    profileBadgeText = badgeText,
                    homeHeaderText = badgeText,
                    daysUntilStart = 0,
                    daysElapsed = MissionConstants.TOTAL_MISSION_DAYS,
                    daysRemaining = 0,
                    isWarmupMode = false
                )
            }
            else -> {
                // Active Mission Window: 2026-11-20 <= today <= 2027-02-15
                val diffDays = ((todayDate.time - startDate.time) / (1000 * 60 * 60 * 24)).toInt()
                val currentDay = (diffDays + 1).coerceIn(1, MissionConstants.TOTAL_MISSION_DAYS)
                val currentStreak = userStreak.coerceIn(0, currentDay)
                val badgeText = "🔥 ${currentStreak}d / 88d Streak"
                MissionStreakInfo(
                    streakDays = currentStreak,
                    totalMissionDays = MissionConstants.TOTAL_MISSION_DAYS,
                    phaseState = MissionPhaseState.ACTIVE_MISSION,
                    profileBadgeText = badgeText,
                    homeHeaderText = badgeText,
                    daysUntilStart = 0,
                    daysElapsed = currentDay,
                    daysRemaining = (MissionConstants.TOTAL_MISSION_DAYS - currentDay).coerceAtLeast(0),
                    isWarmupMode = false
                )
            }
        }
    }
}
