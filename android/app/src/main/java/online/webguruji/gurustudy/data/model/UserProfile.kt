package online.webguruji.gurustudy.data.model

data class UserProfile(
    val fullName: String = "",
    val dateOfBirth: String = "",
    val className: String = "Class 10th",
    val section: String = "A",
    val schoolName: String = "",
    val preferredLanguage: String = "en", // "en" or "hi"
    val dailyStudyGoalMinutes: Int = 120,
    val hindiCourse: String = "Course A", // "Course A" or "Course B"
    val studyStreak: Int = 1,
    val lastStudyDate: String = "",
    val isOnboarded: Boolean = false
)
