package online.webguruji.gurustudy.data.model

data class StudySlotItem(
    val id: String = "",
    val subject: String = "",
    val time: String = "",
    val durationMinutes: Int = 60,
    val topic: String = "",
    val target: String = "",
    val chapter: String = "",
    var scheduledTime: String = "06:00",
    var completed: Boolean = false,
    var alarmEnabled: Boolean = true
)

data class StudyScheduleItem(
    val dayIndex: Int = 1,
    val date: String = "", // "YYYY-MM-DD"
    val dayOfWeek: String = "",
    val phase: String = "Phase 1: Foundation Building",
    val phaseName: String = "",
    val isSunday: Boolean = false,
    val sundayBufferRule: String = "",
    val totalDailyHours: Int = 4,
    val subject: String = "",
    val book: String = "",
    val chapterNumber: Int = 1,
    val chapterTitle: String = "",
    val chapterTitleHi: String = "",
    val topic: String = "",
    val learningTarget: String = "",
    val estimatedMinutes: Int = 240,
    val revisionTarget: String = "",
    val type: String = "Study", // "Study", "Revision", "MockTest", "Backlog Buffer"
    var status: String = "Pending", // "Pending", "In Progress", "Completed"
    var scheduledTime: String = "06:00",
    var alarmEnabled: Boolean = true,
    var slots: List<StudySlotItem> = emptyList()
) {
    val phaseNumber: Int
        get() = when {
            phase.contains("1") -> 1
            phase.contains("2") -> 2
            phase.contains("3") -> 3
            phase.contains("4") -> 4
            phase.contains("5") -> 5
            else -> 1
        }
}

data class PlanStatusInfo(
    val dayIndex: Int = 1,
    val status: String = "Active", // "Upcoming", "Active", "Completed"
    val message: String = "",
    val phase: Int = 1,
    val phaseName: String = "Foundation Building",
    val isPreview: Boolean = false
)

data class FocusSessionItem(
    val id: String = "",
    val subject: String = "",
    val chapter: String = "",
    val durationMinutes: Int = 25,
    val timestamp: Long = System.currentTimeMillis(),
    val mode: String = "Pomodoro",
    val completed: Boolean = true
)

data class BackupPayload(
    val appVersion: String = "2.0.0",
    val exportDate: String = "",
    val profile: UserProfile? = null,
    val schedules: List<StudyScheduleItem> = emptyList(),
    val mistakes: List<MistakeItem> = emptyList(),
    val focusSessions: List<FocusSessionItem> = emptyList()
)
