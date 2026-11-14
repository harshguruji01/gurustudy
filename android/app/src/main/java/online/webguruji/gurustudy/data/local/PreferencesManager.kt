package online.webguruji.gurustudy.data.local

import android.content.Context
import android.content.SharedPreferences
import online.webguruji.gurustudy.data.model.UserProfile
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class PreferencesManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("gurustudy_secure_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_FULL_NAME = "key_full_name"
        private const val KEY_DOB = "key_dob"
        private const val KEY_CLASS = "key_class"
        private const val KEY_SECTION = "key_section"
        private const val KEY_SCHOOL = "key_school"
        private const val KEY_LANG = "key_language"
        private const val KEY_DAILY_GOAL = "key_daily_goal"
        private const val KEY_HINDI_COURSE = "key_hindi_course"
        private const val KEY_STREAK = "key_streak"
        private const val KEY_LAST_STUDY_DATE = "key_last_study_date"
        private const val KEY_ONBOARDED = "key_onboarded"
        private const val KEY_DARK_MODE = "key_dark_mode"
        private const val KEY_FLOATING_REMINDER = "key_floating_reminder"
        private const val KEY_VOICE_ANNOUNCEMENT = "key_voice_announcement"
        private const val KEY_SLOT_TIME_PREFIX = "key_slot_time_"
        private const val KEY_SLOT_ENABLED_PREFIX = "key_slot_enabled_"
    }

    fun saveProfile(profile: UserProfile) {
        prefs.edit().apply {
            putString(KEY_FULL_NAME, profile.fullName)
            putString(KEY_DOB, profile.dateOfBirth)
            putString(KEY_CLASS, profile.className)
            putString(KEY_SECTION, profile.section)
            putString(KEY_SCHOOL, profile.schoolName)
            putString(KEY_LANG, profile.preferredLanguage)
            putInt(KEY_DAILY_GOAL, profile.dailyStudyGoalMinutes)
            putString(KEY_HINDI_COURSE, profile.hindiCourse)
            putInt(KEY_STREAK, profile.studyStreak)
            putString(KEY_LAST_STUDY_DATE, profile.lastStudyDate)
            putBoolean(KEY_ONBOARDED, profile.isOnboarded)
            apply()
        }
    }

    fun getProfile(): UserProfile {
        return UserProfile(
            fullName = prefs.getString(KEY_FULL_NAME, "") ?: "",
            dateOfBirth = prefs.getString(KEY_DOB, "") ?: "",
            className = prefs.getString(KEY_CLASS, "Class 10th") ?: "Class 10th",
            section = prefs.getString(KEY_SECTION, "A") ?: "A",
            schoolName = prefs.getString(KEY_SCHOOL, "") ?: "",
            preferredLanguage = prefs.getString(KEY_LANG, "en") ?: "en",
            dailyStudyGoalMinutes = prefs.getInt(KEY_DAILY_GOAL, 120),
            hindiCourse = prefs.getString(KEY_HINDI_COURSE, "Course A") ?: "Course A",
            studyStreak = prefs.getInt(KEY_STREAK, 1),
            lastStudyDate = prefs.getString(KEY_LAST_STUDY_DATE, "") ?: "",
            isOnboarded = prefs.getBoolean(KEY_ONBOARDED, false)
        )
    }

    fun isOnboarded(): Boolean = prefs.getBoolean(KEY_ONBOARDED, false)

    fun setLanguage(lang: String) {
        prefs.edit().putString(KEY_LANG, lang).apply()
    }

    fun getLanguage(): String = prefs.getString(KEY_LANG, "en") ?: "en"

    fun setDarkMode(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_DARK_MODE, enabled).apply()
    }

    fun isDarkMode(): Boolean = prefs.getBoolean(KEY_DARK_MODE, false)

    fun isFloatingReminderEnabled(): Boolean = prefs.getBoolean(KEY_FLOATING_REMINDER, true)

    fun setFloatingReminderEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_FLOATING_REMINDER, enabled).apply()
    }

    fun isVoiceAnnouncementEnabled(): Boolean = prefs.getBoolean(KEY_VOICE_ANNOUNCEMENT, true)

    fun setVoiceAnnouncementEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_VOICE_ANNOUNCEMENT, enabled).apply()
    }

    fun getSlotAlarmTime(slotIndex: Int): String {
        val defaultTime = when (slotIndex) {
            0 -> "06:00"
            1 -> "17:30"
            2 -> "19:00"
            3 -> "20:30"
            else -> "06:00"
        }
        return prefs.getString(KEY_SLOT_TIME_PREFIX + slotIndex, defaultTime) ?: defaultTime
    }

    fun setSlotAlarmTime(slotIndex: Int, time: String) {
        prefs.edit().putString(KEY_SLOT_TIME_PREFIX + slotIndex, time).apply()
    }

    fun isSlotAlarmEnabled(slotIndex: Int): Boolean {
        return prefs.getBoolean(KEY_SLOT_ENABLED_PREFIX + slotIndex, true)
    }

    fun setSlotAlarmEnabled(slotIndex: Int, enabled: Boolean) {
        prefs.edit().putBoolean(KEY_SLOT_ENABLED_PREFIX + slotIndex, enabled).apply()
    }

    fun recordStudySessionCompleted() {
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val lastDate = prefs.getString(KEY_LAST_STUDY_DATE, "")
        var currentStreak = prefs.getInt(KEY_STREAK, 1)

        if (lastDate != today) {
            currentStreak += 1
            prefs.edit()
                .putString(KEY_LAST_STUDY_DATE, today)
                .putInt(KEY_STREAK, currentStreak)
                .apply()
        }
    }

    fun clearAllData() {
        prefs.edit().clear().apply()
    }
}
