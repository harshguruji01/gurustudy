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
        private const val KEY_GEMINI_API_KEY = "key_gemini_api_key"
        private const val KEY_ADAPTIVE_PLANNER = "key_adaptive_planner"

        // Appearance
        private const val KEY_THEME_MODE = "key_theme_mode" // "system", "light", "dark"
        private const val KEY_ACCENT_COLOR = "key_accent_color" // "royal_blue", "emerald", "purple", "crimson"
        private const val KEY_FONT_SCALE = "key_font_scale" // "small", "standard", "large"
        private const val KEY_REDUCED_MOTION = "key_reduced_motion"
        private const val KEY_COMPACT_DENSITY = "key_compact_density"

        // Study & Timer
        private const val KEY_BREAK_DURATION = "key_break_duration" // 5, 10, 15
        private const val KEY_WORK_DURATION = "key_work_duration" // 25
        private const val KEY_TIMER_SOUND = "key_timer_sound"
        private const val KEY_TIMER_VIBRATE = "key_timer_vibrate"
        private const val KEY_AUTO_SCHEDULE_SUNDAY = "key_auto_schedule_sunday"

        // Reading Preferences
        private const val KEY_READER_THEME = "key_reader_theme" // "light", "dark", "sepia"
        private const val KEY_READER_FONT_SIZE = "key_reader_font_size" // 16
        private const val KEY_READER_LINE_SPACING = "key_reader_line_spacing" // 1.6f
        private const val KEY_LAST_READ_SUBJ = "key_last_read_subj"
        private const val KEY_LAST_READ_CH = "key_last_read_ch"
        private const val KEY_LAST_READ_TIME = "key_last_read_time"

        // Dashboard Customization
        private const val KEY_DASH_ALARMS = "key_dash_alarms"
        private const val KEY_DASH_WEEKLY = "key_dash_weekly"
        private const val KEY_DASH_WEAK_CH = "key_dash_weak_ch"
        private const val KEY_DASH_ACHIEVE = "key_dash_achieve"
        private const val KEY_DASH_CONTINUE = "key_dash_continue"
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

    fun getGeminiApiKey(): String = prefs.getString(KEY_GEMINI_API_KEY, "") ?: ""

    fun setGeminiApiKey(key: String) {
        prefs.edit().putString(KEY_GEMINI_API_KEY, key.trim()).apply()
    }

    fun hasGeminiApiKey(): Boolean = getGeminiApiKey().isNotBlank()

    fun isAdaptivePlannerEnabled(): Boolean = prefs.getBoolean(KEY_ADAPTIVE_PLANNER, true)

    fun setAdaptivePlannerEnabled(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_ADAPTIVE_PLANNER, enabled).apply()
    }

    // Appearance
    fun getThemeMode(): String = prefs.getString(KEY_THEME_MODE, "system") ?: "system"
    fun setThemeMode(mode: String) { prefs.edit().putString(KEY_THEME_MODE, mode).apply() }

    fun getAccentColor(): String = prefs.getString(KEY_ACCENT_COLOR, "royal_blue") ?: "royal_blue"
    fun setAccentColor(color: String) { prefs.edit().putString(KEY_ACCENT_COLOR, color).apply() }

    fun getFontSizeScale(): String = prefs.getString(KEY_FONT_SCALE, "standard") ?: "standard"
    fun setFontSizeScale(scale: String) { prefs.edit().putString(KEY_FONT_SCALE, scale).apply() }

    fun isReducedMotion(): Boolean = prefs.getBoolean(KEY_REDUCED_MOTION, false)
    fun setReducedMotion(reduced: Boolean) { prefs.edit().putBoolean(KEY_REDUCED_MOTION, reduced).apply() }

    fun isCompactDensity(): Boolean = prefs.getBoolean(KEY_COMPACT_DENSITY, false)
    fun setCompactDensity(compact: Boolean) { prefs.edit().putBoolean(KEY_COMPACT_DENSITY, compact).apply() }

    // Study & Timer Preferences
    fun getBreakDuration(): Int = prefs.getInt(KEY_BREAK_DURATION, 5)
    fun setBreakDuration(minutes: Int) { prefs.edit().putInt(KEY_BREAK_DURATION, minutes).apply() }

    fun getWorkDuration(): Int = prefs.getInt(KEY_WORK_DURATION, 25)
    fun setWorkDuration(minutes: Int) { prefs.edit().putInt(KEY_WORK_DURATION, minutes).apply() }

    fun isTimerSoundEnabled(): Boolean = prefs.getBoolean(KEY_TIMER_SOUND, true)
    fun setTimerSoundEnabled(enabled: Boolean) { prefs.edit().putBoolean(KEY_TIMER_SOUND, enabled).apply() }

    fun isTimerVibrateEnabled(): Boolean = prefs.getBoolean(KEY_TIMER_VIBRATE, true)
    fun setTimerVibrateEnabled(enabled: Boolean) { prefs.edit().putBoolean(KEY_TIMER_VIBRATE, enabled).apply() }

    fun isAutoScheduleSundayEnabled(): Boolean = prefs.getBoolean(KEY_AUTO_SCHEDULE_SUNDAY, true)
    fun setAutoScheduleSundayEnabled(enabled: Boolean) { prefs.edit().putBoolean(KEY_AUTO_SCHEDULE_SUNDAY, enabled).apply() }

    // Reading Preferences
    fun getReaderTheme(): String = prefs.getString(KEY_READER_THEME, "light") ?: "light"
    fun setReaderTheme(theme: String) { prefs.edit().putString(KEY_READER_THEME, theme).apply() }

    fun getReaderFontSize(): Int = prefs.getInt(KEY_READER_FONT_SIZE, 15)
    fun setReaderFontSize(size: Int) { prefs.edit().putInt(KEY_READER_FONT_SIZE, size).apply() }

    fun getReaderLineSpacing(): Float = prefs.getFloat(KEY_READER_LINE_SPACING, 1.6f)
    fun setReaderLineSpacing(spacing: Float) { prefs.edit().putFloat(KEY_READER_LINE_SPACING, spacing).apply() }

    fun getLastReadSubject(): String = prefs.getString(KEY_LAST_READ_SUBJ, "Mathematics") ?: "Mathematics"
    fun getLastReadChapter(): String = prefs.getString(KEY_LAST_READ_CH, "Real Numbers") ?: "Real Numbers"
    fun setLastRead(subject: String, chapter: String) {
        prefs.edit()
            .putString(KEY_LAST_READ_SUBJ, subject)
            .putString(KEY_LAST_READ_CH, chapter)
            .putLong(KEY_LAST_READ_TIME, System.currentTimeMillis())
            .apply()
    }

    // Dashboard Customization
    fun isDashAlarmsVisible(): Boolean = prefs.getBoolean(KEY_DASH_ALARMS, true)
    fun setDashAlarmsVisible(visible: Boolean) { prefs.edit().putBoolean(KEY_DASH_ALARMS, visible).apply() }

    fun isDashWeeklyVisible(): Boolean = prefs.getBoolean(KEY_DASH_WEEKLY, true)
    fun setDashWeeklyVisible(visible: Boolean) { prefs.edit().putBoolean(KEY_DASH_WEEKLY, visible).apply() }

    fun isDashWeakChVisible(): Boolean = prefs.getBoolean(KEY_DASH_WEAK_CH, true)
    fun setDashWeakChVisible(visible: Boolean) { prefs.edit().putBoolean(KEY_DASH_WEAK_CH, visible).apply() }

    fun isDashAchieveVisible(): Boolean = prefs.getBoolean(KEY_DASH_ACHIEVE, true)
    fun setDashAchieveVisible(visible: Boolean) { prefs.edit().putBoolean(KEY_DASH_ACHIEVE, visible).apply() }

    fun isDashContinueVisible(): Boolean = prefs.getBoolean(KEY_DASH_CONTINUE, true)
    fun setDashContinueVisible(visible: Boolean) { prefs.edit().putBoolean(KEY_DASH_CONTINUE, visible).apply() }

    fun clearAllData() {
        prefs.edit().clear().apply()
    }
}
