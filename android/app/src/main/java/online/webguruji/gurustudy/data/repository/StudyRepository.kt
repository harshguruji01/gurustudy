package online.webguruji.gurustudy.data.repository

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import online.webguruji.gurustudy.data.local.PreferencesManager
import online.webguruji.gurustudy.data.local.ScheduleDatabaseHelper
import online.webguruji.gurustudy.data.model.MistakeItem
import online.webguruji.gurustudy.data.model.NcertSubject
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
        if (existing.isEmpty()) {
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

    fun getTodaySchedule(): StudyScheduleItem? {
        val todayStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        return getScheduleForDate(todayStr) ?: getAllSchedules().firstOrNull()
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

    fun resetAllData() {
        prefs.clearAllData()
        dbHelper.clearAllData()
        initializeRoadmapIfEmpty()
    }
}
