package online.webguruji.gurustudy.data.repository

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import online.webguruji.gurustudy.data.local.PreferencesManager
import online.webguruji.gurustudy.data.local.ScheduleDatabaseHelper
import online.webguruji.gurustudy.data.model.BackupPayload
import online.webguruji.gurustudy.data.model.FocusSessionItem
import online.webguruji.gurustudy.data.model.MistakeItem
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.model.PlanStatusInfo
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.StudySlotItem
import online.webguruji.gurustudy.data.model.UserProfile
import java.io.InputStreamReader
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class StudyRepository(private val context: Context) {
    private val dbHelper = ScheduleDatabaseHelper(context)
    private val prefs = PreferencesManager(context)
    private val gson = Gson()

    private var cachedSubjects: List<NcertSubject>? = null

    fun getSubjects(): List<NcertSubject> {
        if (cachedSubjects != null) return cachedSubjects!!
        return try {
            val inputStream = context.assets.open("ncert_class10_data.json")
            val reader = InputStreamReader(inputStream, "UTF-8")
            val type = object : TypeToken<List<NcertSubject>>() {}.type
            val list: List<NcertSubject> = gson.fromJson(reader, type)
            reader.close()
            // Defensive normalization: Guarantee non-null progressStatus on all chapters
            list.forEach { subject ->
                subject.books.forEach { book ->
                    book.chapters.forEach { chapter ->
                        if (chapter.progressStatus.isNullOrBlank()) {
                            chapter.progressStatus = "Not Started"
                        }
                    }
                }
            }
            cachedSubjects = list
            list
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    @Synchronized
    fun initializeRoadmapIfEmpty() {
        val existing = dbHelper.getAllSchedules()
        if (existing.isEmpty() || existing.size < 93) {
            try {
                val inputStream = context.assets.open("default_roadmap_93days.json")
                val reader = InputStreamReader(inputStream, "UTF-8")
                val type = object : TypeToken<List<StudyScheduleItem>>() {}.type
                val defaultList: List<StudyScheduleItem> = gson.fromJson(reader, type)
                reader.close()
                dbHelper.insertOrUpdateSchedules(defaultList)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun getAllSchedules(): List<StudyScheduleItem> {
        initializeRoadmapIfEmpty()
        return dbHelper.getAllSchedules()
    }

    fun getScheduleForDate(dateStr: String): StudyScheduleItem? {
        initializeRoadmapIfEmpty()
        return dbHelper.getScheduleForDate(dateStr)
    }

    fun getScheduleForDay(dayIndex: Int): StudyScheduleItem? {
        val all = getAllSchedules()
        return all.find { it.dayIndex == dayIndex } ?: all.firstOrNull()
    }

    fun getPlanStatus(): PlanStatusInfo {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val todayStr = sdf.format(Date())
        val startStr = "2026-11-15"
        val endStr = "2027-02-15"

        val todayDate = sdf.parse(todayStr) ?: Date()
        val startDate = sdf.parse(startStr) ?: Date()
        val endDate = sdf.parse(endStr) ?: Date()

        return when {
            todayDate.before(startDate) -> {
                val diffDays = ((startDate.time - todayDate.time) / (1000 * 60 * 60 * 24)).toInt()
                val msg = if (diffDays <= 1) "Revision plan starts tomorrow! (15 Nov 2026)" else "Revision plan starts in $diffDays days (15 Nov 2026)"
                PlanStatusInfo(
                    dayIndex = 1,
                    status = "Upcoming",
                    message = msg,
                    phase = 1,
                    phaseName = "Foundation Building",
                    isPreview = true
                )
            }
            todayDate.after(endDate) -> {
                PlanStatusInfo(
                    dayIndex = 93,
                    status = "Completed",
                    message = "93-Day Revision Plan Finished! Best of luck for CBSE Board Exams 2027!",
                    phase = 5,
                    phaseName = "Final Board Sprint",
                    isPreview = false
                )
            }
            else -> {
                val diffDays = ((todayDate.time - startDate.time) / (1000 * 60 * 60 * 24)).toInt()
                val currentDay = (diffDays + 1).coerceIn(1, 93)
                val phase = when {
                    currentDay <= 16 -> 1
                    currentDay <= 31 -> 2
                    currentDay <= 47 -> 3
                    currentDay <= 62 -> 4
                    else -> 5
                }
                val phaseName = when (phase) {
                    1 -> "Foundation Building"
                    2 -> "Core Consolidation"
                    3 -> "Advanced Application"
                    4 -> "Full Revision & Weak Spot Remediation"
                    else -> "Final Board Sprint"
                }
                PlanStatusInfo(
                    dayIndex = currentDay,
                    status = "Active",
                    message = "Active Revision Day $currentDay of 93",
                    phase = phase,
                    phaseName = phaseName,
                    isPreview = false
                )
            }
        }
    }

    fun getTodaySchedule(): StudyScheduleItem? {
        val planStatus = getPlanStatus()
        val schedule = getScheduleForDay(planStatus.dayIndex)
        return schedule ?: getAllSchedules().firstOrNull()
    }

    fun getBacklogItemsForSunday(sundayDayIndex: Int): List<StudyScheduleItem> {
        val all = getAllSchedules()
        val startDay = (sundayDayIndex - 6).coerceAtLeast(1)
        return all.filter { it.dayIndex in startDay until sundayDayIndex && it.status != "Completed" }
    }

    fun updateScheduleStatus(dayIndex: Int, newStatus: String) {
        dbHelper.updateStatus(dayIndex, newStatus)
        if (newStatus == "Completed") {
            prefs.recordStudySessionCompleted()
        }
    }

    fun updateScheduleTime(dayIndex: Int, time: String, alarmEnabled: Boolean) {
        dbHelper.updateScheduledTimeAndAlarm(dayIndex, time, alarmEnabled)
    }

    fun updateScheduleItem(item: StudyScheduleItem) {
        dbHelper.insertOrUpdateSchedule(item)
    }

    fun getUserProfile(): UserProfile = prefs.getProfile()

    fun saveUserProfile(profile: UserProfile) = prefs.saveProfile(profile)

    fun isOnboarded(): Boolean = prefs.isOnboarded()

    fun isDarkMode(): Boolean = prefs.isDarkMode()
    fun setDarkMode(enabled: Boolean) = prefs.setDarkMode(enabled)

    fun getLanguage(): String = prefs.getLanguage()
    fun setLanguage(lang: String) = prefs.setLanguage(lang)

    fun addMistake(item: MistakeItem) = dbHelper.addMistake(item)

    fun getAllMistakes(): List<MistakeItem> = dbHelper.getAllMistakes()

    fun isFloatingReminderEnabled(): Boolean = prefs.isFloatingReminderEnabled()
    fun setFloatingReminderEnabled(enabled: Boolean) = prefs.setFloatingReminderEnabled(enabled)

    fun isVoiceAnnouncementEnabled(): Boolean = prefs.isVoiceAnnouncementEnabled()
    fun setVoiceAnnouncementEnabled(enabled: Boolean) = prefs.setVoiceAnnouncementEnabled(enabled)

    fun getSlotAlarmTime(slotIndex: Int): String = prefs.getSlotAlarmTime(slotIndex)
    fun setSlotAlarmTime(slotIndex: Int, time: String) = prefs.setSlotAlarmTime(slotIndex, time)

    fun isSlotAlarmEnabled(slotIndex: Int): Boolean = prefs.isSlotAlarmEnabled(slotIndex)
    fun setSlotAlarmEnabled(slotIndex: Int, enabled: Boolean) = prefs.setSlotAlarmEnabled(slotIndex, enabled)

    fun addFocusSession(session: FocusSessionItem) = dbHelper.addFocusSession(session)
    fun getAllFocusSessions(): List<FocusSessionItem> = dbHelper.getAllFocusSessions()
    fun getTotalFocusMinutes(): Int = dbHelper.getTotalFocusMinutes()

    fun getGeminiApiKey(): String = prefs.getGeminiApiKey()
    fun setGeminiApiKey(key: String) = prefs.setGeminiApiKey(key)
    fun hasGeminiApiKey(): Boolean = prefs.hasGeminiApiKey()

    fun isAdaptivePlannerEnabled(): Boolean = prefs.isAdaptivePlannerEnabled()
    fun setAdaptivePlannerEnabled(enabled: Boolean) = prefs.setAdaptivePlannerEnabled(enabled)

    fun exportBackupJson(): String = gson.toJson(dbHelper.exportBackup(getUserProfile()))
    fun importBackupJson(jsonString: String): Boolean {
        return try {
            val payload = gson.fromJson(jsonString, BackupPayload::class.java)
            if (payload != null && (payload.schedules.isNotEmpty() || payload.profile != null)) {
                if (payload.profile != null) saveUserProfile(payload.profile)
                dbHelper.importBackup(payload)
            } else false
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun getPendingOverdueSlots(): List<Pair<StudyScheduleItem, StudySlotItem>> {
        val planStat = getPlanStatus()
        val overdue = mutableListOf<Pair<StudyScheduleItem, StudySlotItem>>()
        getAllSchedules().filter { it.dayIndex < planStat.dayIndex && it.status != "Completed" }.forEach { day ->
            day.slots.filter { !it.completed }.forEach { slot ->
                overdue.add(Pair(day, slot))
            }
        }
        return overdue
    }

    // Appearance
    fun getThemeMode(): String = prefs.getThemeMode()
    fun setThemeMode(mode: String) = prefs.setThemeMode(mode)
    fun getAccentColor(): String = prefs.getAccentColor()
    fun setAccentColor(color: String) = prefs.setAccentColor(color)
    fun getFontSizeScale(): String = prefs.getFontSizeScale()
    fun setFontSizeScale(scale: String) = prefs.setFontSizeScale(scale)
    fun isReducedMotion(): Boolean = prefs.isReducedMotion()
    fun setReducedMotion(reduced: Boolean) = prefs.setReducedMotion(reduced)
    fun isCompactDensity(): Boolean = prefs.isCompactDensity()
    fun setCompactDensity(compact: Boolean) = prefs.setCompactDensity(compact)

    // Study & Timer
    fun getBreakDuration(): Int = prefs.getBreakDuration()
    fun setBreakDuration(minutes: Int) = prefs.setBreakDuration(minutes)
    fun getWorkDuration(): Int = prefs.getWorkDuration()
    fun setWorkDuration(minutes: Int) = prefs.setWorkDuration(minutes)
    fun isTimerSoundEnabled(): Boolean = prefs.isTimerSoundEnabled()
    fun setTimerSoundEnabled(enabled: Boolean) = prefs.setTimerSoundEnabled(enabled)
    fun isTimerVibrateEnabled(): Boolean = prefs.isTimerVibrateEnabled()
    fun setTimerVibrateEnabled(enabled: Boolean) = prefs.setTimerVibrateEnabled(enabled)
    fun isAutoScheduleSundayEnabled(): Boolean = prefs.isAutoScheduleSundayEnabled()
    fun setAutoScheduleSundayEnabled(enabled: Boolean) = prefs.setAutoScheduleSundayEnabled(enabled)

    // Reader Preferences
    fun getReaderTheme(): String = prefs.getReaderTheme()
    fun setReaderTheme(theme: String) = prefs.setReaderTheme(theme)
    fun getReaderFontSize(): Int = prefs.getReaderFontSize()
    fun setReaderFontSize(size: Int) = prefs.setReaderFontSize(size)
    fun getReaderLineSpacing(): Float = prefs.getReaderLineSpacing()
    fun setReaderLineSpacing(spacing: Float) = prefs.setReaderLineSpacing(spacing)
    fun getLastReadSubject(): String = prefs.getLastReadSubject()
    fun getLastReadChapter(): String = prefs.getLastReadChapter()
    fun setLastRead(subject: String, chapter: String) = prefs.setLastRead(subject, chapter)

    // Dashboard Customization
    fun isDashAlarmsVisible(): Boolean = prefs.isDashAlarmsVisible()
    fun setDashAlarmsVisible(visible: Boolean) = prefs.setDashAlarmsVisible(visible)
    fun isDashWeeklyVisible(): Boolean = prefs.isDashWeeklyVisible()
    fun setDashWeeklyVisible(visible: Boolean) = prefs.setDashWeeklyVisible(visible)
    fun isDashWeakChVisible(): Boolean = prefs.isDashWeakChVisible()
    fun setDashWeakChVisible(visible: Boolean) = prefs.setDashWeakChVisible(visible)
    fun isDashAchieveVisible(): Boolean = prefs.isDashAchieveVisible()
    fun setDashAchieveVisible(visible: Boolean) = prefs.setDashAchieveVisible(visible)
    fun isDashContinueVisible(): Boolean = prefs.isDashContinueVisible()
    fun setDashContinueVisible(visible: Boolean) = prefs.setDashContinueVisible(visible)

    // Daily Alarm Prompt & Sequential Schedule
    fun getLastDailyAlarmPromptDate(): String = prefs.getLastDailyAlarmPromptDate()
    fun setLastDailyAlarmPromptDate(dateStr: String) = prefs.setLastDailyAlarmPromptDate(dateStr)
    fun getDefaultStudyStartTime(): String = prefs.getDefaultStudyStartTime()
    fun setDefaultStudyStartTime(time: String) = prefs.setDefaultStudyStartTime(time)
    fun getInterSubjectBreakMins(): Int = prefs.getInterSubjectBreakMins()
    fun setInterSubjectBreakMins(mins: Int) = prefs.setInterSubjectBreakMins(mins)

    fun resetAllData() {
        prefs.clearAllData()
        dbHelper.clearAllData()
        initializeRoadmapIfEmpty()
    }
}
