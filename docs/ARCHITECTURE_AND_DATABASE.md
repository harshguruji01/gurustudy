# GuruStudy • Technical Architecture & Database Specification

**Application Name:** GuruStudy  
**Package Name:** `online.webguruji.gurustudy`  
**Developer:** HarshGuruJi  
**Official Contact:** contact@webguruji.online  
**Academic Session:** 2026–2027  
**Exam Preparation Calendar:** 15 November 2026 to 15 February 2027 (Strict 93 Days)  

---

## 1. System Architecture Overview

GuruStudy follows the **Clean MVVM (Model-View-ViewModel)** architectural pattern on Android, paired with an **Offline-First Reactive Web Client (PWA)** sharing identical data models and business logic.

```
+-------------------------------------------------------------------------+
|                               UI LAYER                                  |
|  - Jetpack Compose (Material 3) Android Native App                      |
|  - Modern Semantic HTML5/CSS3/ES6 Responsive Web App (PWA)              |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                            DOMAIN & LOGIC                               |
|  - AlarmScheduler (AlarmManager + setExactAndAllowWhileIdle)            |
|  - StudyAlarmReceiver (WakeLock + High Priority Notification)           |
|  - FullScreenAlarmActivity (Lock screen ringing + Voice Announcement)   |
|  - TTSAnnouncer (Android TextToSpeech API + Web Speech API)             |
|  - Study Timer Engine (Circular countdown + chime audio synthesis)      |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                             DATA LAYER                                  |
|  - StudyRepository (Single source of truth)                             |
|  - ScheduleDatabaseHelper (SQLite Room-equivalent local storage)        |
|  - PreferencesManager (Encrypted profile & settings storage)            |
|  - Asset JSON Schemas (ncert_class10_data.json, 93-day roadmap)        |
+-------------------------------------------------------------------------+
```

---

## 2. Database Schema (SQLite / Room & Web Storage)

### 2.1 Table: `study_schedule` (93-Day Exam Calendar)
Stores the daily roadmap spanning 15 Nov 2026 to 15 Feb 2027 along with student customizations:

| Column Name | Type | Description |
|---|---|---|
| `day_index` | `INTEGER PRIMARY KEY` | Day counter from 1 to 93 |
| `date_str` | `TEXT UNIQUE` | Date formatted as `YYYY-MM-DD` |
| `day_of_week` | `TEXT` | `Sunday`, `Monday`, etc. |
| `subject` | `TEXT` | Core subject (Maths, Science, SST, etc.) |
| `book` | `TEXT` | Specific NCERT textbook |
| `chapter_num` | `INTEGER` | Prescribed chapter number |
| `chapter_title` | `TEXT` | Chapter title in English |
| `chapter_title_hi` | `TEXT` | Chapter title in Hindi |
| `topic` | `TEXT` | Specific sub-topic / study focus |
| `learning_target` | `TEXT` | Daily learning target description |
| `est_minutes` | `INTEGER` | Duration (15, 30, 45, 60, 90, 120 mins) |
| `revision_target` | `TEXT` | Targeted practice or revision action |
| `session_type` | `TEXT` | `Study`, `Revision`, `MockTest` |
| `status` | `TEXT` | `Pending`, `In Progress`, `Completed` |
| `scheduled_time` | `TEXT` | Alarm clock time (e.g., `18:00`) |
| `alarm_enabled` | `INTEGER` | `1` if voice alarm active, `0` if silent |

### 2.2 Table: `mistake_notebook` (Targeted Error Revision)
Automatically logs any question answered incorrectly during practice tests:

| Column Name | Type | Description |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Unique UUID timestamp |
| `subject_name` | `TEXT` | Subject name |
| `chapter_title` | `TEXT` | Chapter name |
| `question_text` | `TEXT` | The question stem |
| `wrong_answer` | `TEXT` | Option chosen incorrectly by student |
| `correct_answer` | `TEXT` | The verified correct answer |
| `explanation` | `TEXT` | CBSE pedagogical explanation |
| `date_added` | `TEXT` | Timestamp when mistake occurred |

### 2.3 User Profile Preferences (`PreferencesManager`)
Stored locally and encrypted on device:
- `fullName`: String (used for TTS announcements)
- `dateOfBirth`: String (`YYYY-MM-DD`)
- `className`: "Class 10th"
- `section`: "A"
- `schoolName`: String
- `preferredLanguage`: "en" / "hi"
- `dailyStudyGoalMinutes`: Int (60, 120, 180)
- `hindiCourse`: "Course A" or "Course B"
- `studyStreak`: Int (consecutive active study days)
- `lastStudyDate`: String (`YYYY-MM-DD`)
- `isOnboarded`: Boolean

---

## 3. Strict 93-Day Calendar Engine (15 Nov 2026 – 15 Feb 2027)

1. **Date Boundary:**
   - Starts: `2026-11-15` (Day 1)
   - Ends: `2027-02-15` (Day 93)
   - Total: 93 Calendar Days leading up to the 2027 CBSE Board Exams.
2. **Three-Phase Pedagogical Distribution:**
   - **Phase 1 (Days 1–50: Nov 15 – Jan 3):** Foundation mastery covering every NCERT chapter in Mathematics, Science, Social Science, English, Hindi, and IT.
   - **Phase 2 (Days 51–75: Jan 4 – Jan 28):** High-yield subject sprint, formula revisions, and weekly Sunday Mock Exams.
   - **Phase 3 (Days 76–93: Jan 29 – Feb 15):** Full-length board simulation tests, diagram practice, map skills, and mistake notebook clearance.
3. **Flexibility & Zero-Loss Rescheduling:**
   - If a student misses or reschedules a day, the database allows tapping any date to update chapter, study duration, or alarm time without resetting their completed streak or syllabus progress.

---

## 4. Exact Alarm & TTS Ringing Architecture

### Native Android Flow:
1. `AlarmScheduler` calls `AlarmManager.setExactAndAllowWhileIdle()` at the exact timestamp.
2. At the scheduled minute, the system awakens the device and triggers `StudyAlarmReceiver`.
3. `StudyAlarmReceiver` acquires a temporary WakeLock, builds a high-priority Heads-Up Notification on `study_alarms_channel` with `setFullScreenIntent()`, and starts `FullScreenAlarmActivity`.
4. `FullScreenAlarmActivity`:
   - Awakens screen over keyguard (`setShowWhenLocked(true)`, `setTurnScreenOn(true)`).
   - Starts `TTSAnnouncer` speaking:
     - English: *"Hello [Student Name], it's time to study [Subject]: [Chapter] on GuruStudy!"*
     - Hindi: *"[Student Name] जी, अब आपका [Subject] का पाठ [Chapter] पढ़ने का समय हो गया है!"*
   - Plays alarm chime ringtone via `MediaPlayer`.
   - Offers "Start Studying Now", "Snooze (10m)", or "Dismiss".
   - Tapping "Start Studying Now" transitions immediately into the `StudyTimerScreen` with the countdown active.
5. On phone reboot, `BootReceiver` intercepts `ACTION_BOOT_COMPLETED` and reinstates all pending alarms.

### Web App Flow:
1. Synthesizes melodious multi-harmonic chord chimes using the **HTML5 Web Audio API** (`AudioContext`).
2. Speaks personalized announcement via **Web Speech API** (`window.speechSynthesis`).
3. Launches interactive ringing modal with snooze, dismiss, and instant focus timer options.
