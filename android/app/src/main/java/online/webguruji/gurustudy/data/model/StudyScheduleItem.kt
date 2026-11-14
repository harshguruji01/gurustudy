package online.webguruji.gurustudy.data.model

data class StudyScheduleItem(
    val dayIndex: Int,
    val date: String, // "YYYY-MM-DD"
    val dayOfWeek: String,
    val subject: String,
    val book: String,
    val chapterNumber: Int,
    val chapterTitle: String,
    val chapterTitleHi: String,
    val topic: String,
    val learningTarget: String,
    val estimatedMinutes: Int,
    val revisionTarget: String,
    val type: String, // "Study", "Revision", "MockTest"
    var status: String = "Pending", // "Pending", "In Progress", "Completed"
    var scheduledTime: String = "18:00",
    var alarmEnabled: Boolean = true
)
