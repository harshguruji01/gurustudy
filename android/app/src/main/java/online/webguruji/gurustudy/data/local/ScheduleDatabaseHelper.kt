package online.webguruji.gurustudy.data.local

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import online.webguruji.gurustudy.data.model.BackupPayload
import online.webguruji.gurustudy.data.model.FocusSessionItem
import online.webguruji.gurustudy.data.model.MistakeItem
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.StudySlotItem
import online.webguruji.gurustudy.data.model.UserProfile
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ScheduleDatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    private val gson = Gson()
    private val slotsType = object : TypeToken<List<StudySlotItem>>() {}.type

    companion object {
        const val DATABASE_NAME = "gurustudy_database.db"
        const val DATABASE_VERSION = 4

        // Table Schedules (93-Day Roadmap)
        const val TABLE_SCHEDULE = "study_schedule"
        const val COL_DAY_INDEX = "day_index"
        const val COL_DATE = "date_str"
        const val COL_DAY_OF_WEEK = "day_of_week"
        const val COL_PHASE = "phase"
        const val COL_IS_SUNDAY = "is_sunday"
        const val COL_SUBJECT = "subject"
        const val COL_BOOK = "book"
        const val COL_CHAPTER_NUM = "chapter_num"
        const val COL_CHAPTER_TITLE = "chapter_title"
        const val COL_CHAPTER_TITLE_HI = "chapter_title_hi"
        const val COL_TOPIC = "topic"
        const val COL_LEARNING_TARGET = "learning_target"
        const val COL_EST_MINUTES = "est_minutes"
        const val COL_REVISION_TARGET = "revision_target"
        const val COL_TYPE = "session_type"
        const val COL_STATUS = "status"
        const val COL_SCHEDULED_TIME = "scheduled_time"
        const val COL_ALARM_ENABLED = "alarm_enabled"
        const val COL_SLOTS_JSON = "slots_json"

        // Table Mistakes
        const val TABLE_MISTAKES = "mistake_notebook"
        const val COL_MISTAKE_ID = "id"
        const val COL_MISTAKE_SUBJ = "subject_name"
        const val COL_MISTAKE_CHAPTER = "chapter_title"
        const val COL_MISTAKE_QUESTION = "question_text"
        const val COL_MISTAKE_WRONG = "wrong_answer"
        const val COL_MISTAKE_CORRECT = "correct_answer"
        const val COL_MISTAKE_EXP = "explanation"
        const val COL_MISTAKE_DATE = "date_added"

        // Table Focus Sessions
        const val TABLE_FOCUS_SESSIONS = "focus_sessions"
        const val COL_FOCUS_ID = "id"
        const val COL_FOCUS_SUBJECT = "subject"
        const val COL_FOCUS_CHAPTER = "chapter"
        const val COL_FOCUS_DURATION = "duration_minutes"
        const val COL_FOCUS_TIMESTAMP = "timestamp"
        const val COL_FOCUS_MODE = "mode"
        const val COL_FOCUS_COMPLETED = "completed"
    }

    override fun onCreate(db: SQLiteDatabase) {
        val createScheduleTable = """
            CREATE TABLE $TABLE_SCHEDULE (
                $COL_DAY_INDEX INTEGER PRIMARY KEY,
                $COL_DATE TEXT UNIQUE,
                $COL_DAY_OF_WEEK TEXT,
                $COL_PHASE TEXT,
                $COL_IS_SUNDAY INTEGER DEFAULT 0,
                $COL_SUBJECT TEXT,
                $COL_BOOK TEXT,
                $COL_CHAPTER_NUM INTEGER,
                $COL_CHAPTER_TITLE TEXT,
                $COL_CHAPTER_TITLE_HI TEXT,
                $COL_TOPIC TEXT,
                $COL_LEARNING_TARGET TEXT,
                $COL_EST_MINUTES INTEGER,
                $COL_REVISION_TARGET TEXT,
                $COL_TYPE TEXT,
                $COL_STATUS TEXT,
                $COL_SCHEDULED_TIME TEXT,
                $COL_ALARM_ENABLED INTEGER,
                $COL_SLOTS_JSON TEXT
            )
        """.trimIndent()

        val createMistakesTable = """
            CREATE TABLE $TABLE_MISTAKES (
                $COL_MISTAKE_ID TEXT PRIMARY KEY,
                $COL_MISTAKE_SUBJ TEXT,
                $COL_MISTAKE_CHAPTER TEXT,
                $COL_MISTAKE_QUESTION TEXT,
                $COL_MISTAKE_WRONG TEXT,
                $COL_MISTAKE_CORRECT TEXT,
                $COL_MISTAKE_EXP TEXT,
                $COL_MISTAKE_DATE TEXT
            )
        """.trimIndent()

        val createFocusTable = """
            CREATE TABLE $TABLE_FOCUS_SESSIONS (
                $COL_FOCUS_ID TEXT PRIMARY KEY,
                $COL_FOCUS_SUBJECT TEXT,
                $COL_FOCUS_CHAPTER TEXT,
                $COL_FOCUS_DURATION INTEGER,
                $COL_FOCUS_TIMESTAMP INTEGER,
                $COL_FOCUS_MODE TEXT,
                $COL_FOCUS_COMPLETED INTEGER
            )
        """.trimIndent()

        db.execSQL(createScheduleTable)
        db.execSQL(createMistakesTable)
        db.execSQL(createFocusTable)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        if (oldVersion < 2) {
            val createMistakesTable = """
                CREATE TABLE IF NOT EXISTS $TABLE_MISTAKES (
                    $COL_MISTAKE_ID TEXT PRIMARY KEY,
                    $COL_MISTAKE_SUBJ TEXT,
                    $COL_MISTAKE_CHAPTER TEXT,
                    $COL_MISTAKE_QUESTION TEXT,
                    $COL_MISTAKE_WRONG TEXT,
                    $COL_MISTAKE_CORRECT TEXT,
                    $COL_MISTAKE_EXP TEXT,
                    $COL_MISTAKE_DATE TEXT
                )
            """.trimIndent()
            db.execSQL(createMistakesTable)
        }
        if (oldVersion < 3) {
            val createFocusTable = """
                CREATE TABLE IF NOT EXISTS $TABLE_FOCUS_SESSIONS (
                    $COL_FOCUS_ID TEXT PRIMARY KEY,
                    $COL_FOCUS_SUBJECT TEXT,
                    $COL_FOCUS_CHAPTER TEXT,
                    $COL_FOCUS_DURATION INTEGER,
                    $COL_FOCUS_TIMESTAMP INTEGER,
                    $COL_FOCUS_MODE TEXT,
                    $COL_FOCUS_COMPLETED INTEGER
                )
            """.trimIndent()
            db.execSQL(createFocusTable)
        }
        if (oldVersion < 4) {
            ensureColumnExists(db, TABLE_SCHEDULE, COL_SLOTS_JSON, "TEXT")
            ensureColumnExists(db, TABLE_SCHEDULE, COL_CHAPTER_TITLE_HI, "TEXT")
            ensureColumnExists(db, TABLE_SCHEDULE, COL_PHASE, "TEXT")
            ensureColumnExists(db, TABLE_SCHEDULE, COL_SCHEDULED_TIME, "TEXT")
            ensureColumnExists(db, TABLE_SCHEDULE, COL_ALARM_ENABLED, "INTEGER DEFAULT 0")
        }
    }

    private fun ensureColumnExists(db: SQLiteDatabase, tableName: String, columnName: String, columnType: String) {
        try {
            val cursor = db.rawQuery("PRAGMA table_info($tableName)", null)
            var exists = false
            cursor.use {
                val nameIdx = it.getColumnIndex("name")
                while (it.moveToNext()) {
                    if (nameIdx != -1 && it.getString(nameIdx).equals(columnName, ignoreCase = true)) {
                        exists = true
                        break
                    }
                }
            }
            if (!exists) {
                db.execSQL("ALTER TABLE $tableName ADD COLUMN $columnName $columnType")
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun android.database.Cursor.getStringSafe(columnName: String, defaultValue: String = ""): String {
        val index = getColumnIndex(columnName)
        return if (index != -1 && !isNull(index)) getString(index) ?: defaultValue else defaultValue
    }

    private fun android.database.Cursor.getIntSafe(columnName: String, defaultValue: Int = 0): Int {
        val index = getColumnIndex(columnName)
        return if (index != -1 && !isNull(index)) getInt(index) else defaultValue
    }

    @Synchronized
    fun insertOrUpdateSchedules(items: List<StudyScheduleItem>) {
        val db = writableDatabase
        db.beginTransaction()
        try {
            for (item in items) {
                val values = ContentValues().apply {
                    put(COL_DAY_INDEX, item.dayIndex)
                    put(COL_DATE, item.date)
                    put(COL_DAY_OF_WEEK, item.dayOfWeek)
                    put(COL_PHASE, item.phase)
                    put(COL_IS_SUNDAY, if (item.isSunday) 1 else 0)
                    put(COL_SUBJECT, item.subject)
                    put(COL_BOOK, item.book)
                    put(COL_CHAPTER_NUM, item.chapterNumber)
                    put(COL_CHAPTER_TITLE, item.chapterTitle)
                    put(COL_CHAPTER_TITLE_HI, item.chapterTitleHi)
                    put(COL_TOPIC, item.topic)
                    put(COL_LEARNING_TARGET, item.learningTarget)
                    put(COL_EST_MINUTES, item.estimatedMinutes)
                    put(COL_REVISION_TARGET, item.revisionTarget)
                    put(COL_TYPE, item.type)
                    put(COL_STATUS, item.status)
                    put(COL_SCHEDULED_TIME, item.scheduledTime)
                    put(COL_ALARM_ENABLED, if (item.alarmEnabled) 1 else 0)
                    put(COL_SLOTS_JSON, gson.toJson(item.slots))
                }
                db.insertWithOnConflict(TABLE_SCHEDULE, null, values, SQLiteDatabase.CONFLICT_REPLACE)
            }
            db.setTransactionSuccessful()
        } finally {
            db.endTransaction()
        }
    }

    @Synchronized
    fun insertOrUpdateSchedule(item: StudyScheduleItem) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_DAY_INDEX, item.dayIndex)
            put(COL_DATE, item.date)
            put(COL_DAY_OF_WEEK, item.dayOfWeek)
            put(COL_PHASE, item.phase)
            put(COL_IS_SUNDAY, if (item.isSunday) 1 else 0)
            put(COL_SUBJECT, item.subject)
            put(COL_BOOK, item.book)
            put(COL_CHAPTER_NUM, item.chapterNumber)
            put(COL_CHAPTER_TITLE, item.chapterTitle)
            put(COL_CHAPTER_TITLE_HI, item.chapterTitleHi)
            put(COL_TOPIC, item.topic)
            put(COL_LEARNING_TARGET, item.learningTarget)
            put(COL_EST_MINUTES, item.estimatedMinutes)
            put(COL_REVISION_TARGET, item.revisionTarget)
            put(COL_TYPE, item.type)
            put(COL_STATUS, item.status)
            put(COL_SCHEDULED_TIME, item.scheduledTime)
            put(COL_ALARM_ENABLED, if (item.alarmEnabled) 1 else 0)
            put(COL_SLOTS_JSON, gson.toJson(item.slots))
        }
        db.insertWithOnConflict(TABLE_SCHEDULE, null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    @Synchronized
    fun getAllSchedules(): List<StudyScheduleItem> {
        val list = mutableListOf<StudyScheduleItem>()
        val db = readableDatabase
        val cursor = db.query(TABLE_SCHEDULE, null, null, null, null, null, "$COL_DAY_INDEX ASC")
        cursor.use {
            while (it.moveToNext()) {
                val slotsJson = it.getStringSafe(COL_SLOTS_JSON)
                val slots: List<StudySlotItem> = if (slotsJson.isNotBlank()) {
                    try { gson.fromJson(slotsJson, slotsType) ?: emptyList() } catch (e: Exception) { emptyList() }
                } else emptyList()

                val phaseStr = it.getStringSafe(COL_PHASE, "Phase 1: Foundation Building")

                val item = StudyScheduleItem(
                    dayIndex = it.getIntSafe(COL_DAY_INDEX),
                    date = it.getStringSafe(COL_DATE),
                    dayOfWeek = it.getStringSafe(COL_DAY_OF_WEEK),
                    phase = phaseStr,
                    isSunday = it.getIntSafe(COL_IS_SUNDAY) == 1,
                    subject = it.getStringSafe(COL_SUBJECT),
                    book = it.getStringSafe(COL_BOOK),
                    chapterNumber = it.getIntSafe(COL_CHAPTER_NUM),
                    chapterTitle = it.getStringSafe(COL_CHAPTER_TITLE),
                    chapterTitleHi = it.getStringSafe(COL_CHAPTER_TITLE_HI),
                    topic = it.getStringSafe(COL_TOPIC),
                    learningTarget = it.getStringSafe(COL_LEARNING_TARGET),
                    estimatedMinutes = it.getIntSafe(COL_EST_MINUTES),
                    revisionTarget = it.getStringSafe(COL_REVISION_TARGET),
                    type = it.getStringSafe(COL_TYPE),
                    status = it.getStringSafe(COL_STATUS),
                    scheduledTime = it.getStringSafe(COL_SCHEDULED_TIME),
                    alarmEnabled = it.getIntSafe(COL_ALARM_ENABLED) == 1,
                    slots = slots
                )
                list.add(item)
            }
        }
        return list
    }

    @Synchronized
    fun getScheduleForDate(dateStr: String): StudyScheduleItem? {
        val db = readableDatabase
        val cursor = db.query(
            TABLE_SCHEDULE,
            null,
            "$COL_DATE = ?",
            arrayOf(dateStr),
            null,
            null,
            null
        )
        cursor.use {
            if (it.moveToFirst()) {
                val slotsJson = it.getStringSafe(COL_SLOTS_JSON)
                val slots: List<StudySlotItem> = if (slotsJson.isNotBlank()) {
                    try { gson.fromJson(slotsJson, slotsType) ?: emptyList() } catch (e: Exception) { emptyList() }
                } else emptyList()

                val phaseStr = it.getStringSafe(COL_PHASE, "Phase 1: Foundation Building")

                return StudyScheduleItem(
                    dayIndex = it.getIntSafe(COL_DAY_INDEX),
                    date = it.getStringSafe(COL_DATE),
                    dayOfWeek = it.getStringSafe(COL_DAY_OF_WEEK),
                    phase = phaseStr,
                    isSunday = it.getIntSafe(COL_IS_SUNDAY) == 1,
                    subject = it.getStringSafe(COL_SUBJECT),
                    book = it.getStringSafe(COL_BOOK),
                    chapterNumber = it.getIntSafe(COL_CHAPTER_NUM),
                    chapterTitle = it.getStringSafe(COL_CHAPTER_TITLE),
                    chapterTitleHi = it.getStringSafe(COL_CHAPTER_TITLE_HI),
                    topic = it.getStringSafe(COL_TOPIC),
                    learningTarget = it.getStringSafe(COL_LEARNING_TARGET),
                    estimatedMinutes = it.getIntSafe(COL_EST_MINUTES),
                    revisionTarget = it.getStringSafe(COL_REVISION_TARGET),
                    type = it.getStringSafe(COL_TYPE),
                    status = it.getStringSafe(COL_STATUS),
                    scheduledTime = it.getStringSafe(COL_SCHEDULED_TIME),
                    alarmEnabled = it.getIntSafe(COL_ALARM_ENABLED) == 1,
                    slots = slots
                )
            }
        }
        return null
    }

    fun updateStatus(dayIndex: Int, newStatus: String) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_STATUS, newStatus)
        }
        db.update(TABLE_SCHEDULE, values, "$COL_DAY_INDEX = ?", arrayOf(dayIndex.toString()))
    }

    fun updateScheduledTimeAndAlarm(dayIndex: Int, time: String, enabled: Boolean) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_SCHEDULED_TIME, time)
            put(COL_ALARM_ENABLED, if (enabled) 1 else 0)
        }
        db.update(TABLE_SCHEDULE, values, "$COL_DAY_INDEX = ?", arrayOf(dayIndex.toString()))
    }

    fun addMistake(item: MistakeItem) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_MISTAKE_ID, item.id)
            put(COL_MISTAKE_SUBJ, item.subjectName)
            put(COL_MISTAKE_CHAPTER, item.chapterTitle)
            put(COL_MISTAKE_QUESTION, item.questionText)
            put(COL_MISTAKE_WRONG, item.selectedWrongAnswer)
            put(COL_MISTAKE_CORRECT, item.correctAnswer)
            put(COL_MISTAKE_EXP, item.explanation)
            put(COL_MISTAKE_DATE, item.dateAdded)
        }
        db.insertWithOnConflict(TABLE_MISTAKES, null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun getAllMistakes(): List<MistakeItem> {
        val list = mutableListOf<MistakeItem>()
        val db = readableDatabase
        val cursor = db.query(TABLE_MISTAKES, null, null, null, null, null, "$COL_MISTAKE_DATE DESC")
        cursor.use {
            while (it.moveToNext()) {
                list.add(
                    MistakeItem(
                        id = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_ID)),
                        subjectName = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_SUBJ)),
                        chapterTitle = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_CHAPTER)),
                        questionText = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_QUESTION)),
                        selectedWrongAnswer = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_WRONG)),
                        correctAnswer = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_CORRECT)),
                        explanation = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_EXP)),
                        dateAdded = it.getString(it.getColumnIndexOrThrow(COL_MISTAKE_DATE))
                    )
                )
            }
        }
        return list
    }

    fun addFocusSession(session: FocusSessionItem) {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COL_FOCUS_ID, session.id)
            put(COL_FOCUS_SUBJECT, session.subject)
            put(COL_FOCUS_CHAPTER, session.chapter)
            put(COL_FOCUS_DURATION, session.durationMinutes)
            put(COL_FOCUS_TIMESTAMP, session.timestamp)
            put(COL_FOCUS_MODE, session.mode)
            put(COL_FOCUS_COMPLETED, if (session.completed) 1 else 0)
        }
        db.insertWithOnConflict(TABLE_FOCUS_SESSIONS, null, values, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun getAllFocusSessions(): List<FocusSessionItem> {
        val list = mutableListOf<FocusSessionItem>()
        val db = readableDatabase
        val cursor = db.query(TABLE_FOCUS_SESSIONS, null, null, null, null, null, "$COL_FOCUS_TIMESTAMP DESC")
        cursor.use {
            while (it.moveToNext()) {
                list.add(
                    FocusSessionItem(
                        id = it.getString(it.getColumnIndexOrThrow(COL_FOCUS_ID)),
                        subject = it.getString(it.getColumnIndexOrThrow(COL_FOCUS_SUBJECT)),
                        chapter = it.getString(it.getColumnIndexOrThrow(COL_FOCUS_CHAPTER)),
                        durationMinutes = it.getInt(it.getColumnIndexOrThrow(COL_FOCUS_DURATION)),
                        timestamp = it.getLong(it.getColumnIndexOrThrow(COL_FOCUS_TIMESTAMP)),
                        mode = it.getString(it.getColumnIndexOrThrow(COL_FOCUS_MODE)),
                        completed = it.getInt(it.getColumnIndexOrThrow(COL_FOCUS_COMPLETED)) == 1
                    )
                )
            }
        }
        return list
    }

    fun getTotalFocusMinutes(): Int {
        val db = readableDatabase
        val cursor = db.rawQuery("SELECT SUM($COL_FOCUS_DURATION) FROM $TABLE_FOCUS_SESSIONS WHERE $COL_FOCUS_COMPLETED = 1", null)
        var total = 0
        cursor.use {
            if (it.moveToFirst() && !it.isNull(0)) {
                total = it.getInt(0)
            }
        }
        return total
    }

    fun exportBackup(profile: UserProfile): BackupPayload {
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        return BackupPayload(
            appVersion = "2.0.0",
            exportDate = sdf.format(Date()),
            profile = profile,
            schedules = getAllSchedules(),
            mistakes = getAllMistakes(),
            focusSessions = getAllFocusSessions()
        )
    }

    fun importBackup(payload: BackupPayload): Boolean {
        val db = writableDatabase
        db.beginTransaction()
        return try {
            if (payload.schedules.isNotEmpty()) {
                for (item in payload.schedules) {
                    insertOrUpdateSchedule(item)
                }
            }
            if (payload.mistakes.isNotEmpty()) {
                for (mistake in payload.mistakes) {
                    addMistake(mistake)
                }
            }
            if (payload.focusSessions.isNotEmpty()) {
                for (focus in payload.focusSessions) {
                    addFocusSession(focus)
                }
            }
            db.setTransactionSuccessful()
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        } finally {
            db.endTransaction()
        }
    }

    fun clearAllData() {
        val db = writableDatabase
        db.delete(TABLE_SCHEDULE, null, null)
        db.delete(TABLE_MISTAKES, null, null)
        db.delete(TABLE_FOCUS_SESSIONS, null, null)
    }
}
