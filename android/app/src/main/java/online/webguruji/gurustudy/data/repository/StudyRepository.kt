package online.webguruji.gurustudy.data.repository

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import online.webguruji.gurustudy.data.local.PreferencesManager
import online.webguruji.gurustudy.data.local.ScheduleDatabaseHelper
import online.webguruji.gurustudy.data.model.MistakeItem
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.model.PlanStatusInfo
import online.webguruji.gurustudy.data.model.StudyScheduleItem
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

    fun initializeRoadmapIfEmpty() {
        val existing = dbHelper.getAllSchedules()
        if (existing.isEmpty() || existing.size < 93) {
            try {
                val inputStream = context.assets.open("default_roadmap_93days.json")
                val reader = InputStreamReader(inputStream, "UTF-8")
                val type = object : TypeToken<List<StudyScheduleItem>>() {}.type
                val defaultList: List<StudyScheduleItem> = gson.fromJson(reader, type)
                reader.close()
                for (item in defaultList) {
                    dbHelper.insertOrUpdateSchedule(item)
                }
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

    fun resetAllData() {
        prefs.clearAllData()
        dbHelper.clearAllData()
        initializeRoadmapIfEmpty()
    }
}
