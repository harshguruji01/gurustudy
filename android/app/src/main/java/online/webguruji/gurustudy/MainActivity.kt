package online.webguruji.gurustudy

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import online.webguruji.gurustudy.alarm.AlarmScheduler
import online.webguruji.gurustudy.data.model.NcertChapter
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.ui.screens.*
import online.webguruji.gurustudy.ui.theme.GuruStudyTheme
import online.webguruji.gurustudy.ui.theme.RoyalBlue

class MainActivity : ComponentActivity() {

    private lateinit var repository: StudyRepository
    private lateinit var alarmScheduler: AlarmScheduler

    private val requestNotificationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { _ ->
            // Permission result handled gracefully
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        repository = StudyRepository(this)
        alarmScheduler = AlarmScheduler(this)

        checkAndRequestPermissions()

        val navigateTo = intent.getStringExtra("NAVIGATE_TO")
        val alarmSubj = intent.getStringExtra("SUBJECT") ?: "Mathematics"
        val alarmCh = intent.getStringExtra("CHAPTER") ?: "Real Numbers"
        val alarmDur = intent.getIntExtra("DURATION", 45)

        setContent {
            var isDarkMode by remember { mutableStateOf(repository.getUserProfile().let { false }) }
            var userProfile by remember { mutableStateOf(repository.getUserProfile()) }
            var isOnboarded by remember { mutableStateOf(repository.isOnboarded()) }
            var welcomePassed by remember { mutableStateOf(isOnboarded) }

            var currentNavTab by remember { mutableIntStateOf(0) } // 0: Home, 1: Books, 2: Calendar, 3: Practice, 4: Profile
            var selectedChapterSubject by remember { mutableStateOf<Pair<NcertSubject, NcertChapter>?>(null) }
            var activeTimerSession by remember {
                mutableStateOf(
                    if (navigateTo == "STUDY_TIMER") Triple(alarmSubj, alarmCh, alarmDur) else null
                )
            }

            var schedules by remember { mutableStateOf(repository.getAllSchedules()) }
            val subjects by remember { mutableStateOf(repository.getSubjects()) }
            var mistakes by remember { mutableStateOf(repository.getAllMistakes()) }

            GuruStudyTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    when {
                        // Flow 1: Welcome Screen
                        !welcomePassed -> {
                            WelcomeScreen(
                                onLetsGoClicked = {
                                    welcomePassed = true
                                }
                            )
                        }

                        // Flow 2: Onboarding Setup Screen
                        !isOnboarded -> {
                            OnboardingScreen(
                                onSaveProfile = { profile ->
                                    repository.saveUserProfile(profile)
                                    userProfile = profile
                                    isOnboarded = true

                                    // Schedule upcoming alarms for user
                                    schedules.take(7).forEach { item ->
                                        if (item.alarmEnabled) {
                                            alarmScheduler.scheduleStudyAlarm(item, profile.fullName)
                                        }
                                    }
                                }
                            )
                        }

                        // Flow 3: Active Study Timer
                        activeTimerSession != null -> {
                            val (subj, ch, dur) = activeTimerSession!!
                            StudyTimerScreen(
                                subjectName = subj,
                                chapterTitle = ch,
                                initialMinutes = dur,
                                onBackClicked = { activeTimerSession = null },
                                onSessionCompleted = {
                                    // Mark today's schedule completed
                                    val today = repository.getTodaySchedule()
                                    if (today != null) {
                                        repository.updateScheduleStatus(today.dayIndex, "Completed")
                                        schedules = repository.getAllSchedules()
                                    }
                                    userProfile = repository.getUserProfile()
                                    activeTimerSession = null
                                }
                            )
                        }

                        // Flow 4: Chapter Details View
                        selectedChapterSubject != null -> {
                            val (subj, ch) = selectedChapterSubject!!
                            ChapterDetailScreen(
                                subject = subj,
                                chapter = ch,
                                onBackClicked = { selectedChapterSubject = null },
                                onStartStudyTimer = { s, c ->
                                    activeTimerSession = Triple(s.name, c.title, 45)
                                    selectedChapterSubject = null
                                }
                            )
                        }

                        // Flow 5: Main Dashboard with Navigation
                        else -> {
                            Scaffold(
                                bottomBar = {
                                    NavigationBar(
                                        containerColor = MaterialTheme.colorScheme.surface,
                                        tonalElevation = 8.dp
                                    ) {
                                        NavigationBarItem(
                                            selected = currentNavTab == 0,
                                            onClick = { currentNavTab = 0 },
                                            icon = { Text("🏠") },
                                            label = { Text("Home") }
                                        )
                                        NavigationBarItem(
                                            selected = currentNavTab == 1,
                                            onClick = { currentNavTab = 1 },
                                            icon = { Text("📚") },
                                            label = { Text("Books") }
                                        )
                                        NavigationBarItem(
                                            selected = currentNavTab == 2,
                                            onClick = { currentNavTab = 2 },
                                            icon = { Text("📅") },
                                            label = { Text("Calendar") }
                                        )
                                        NavigationBarItem(
                                            selected = currentNavTab == 3,
                                            onClick = { currentNavTab = 3 },
                                            icon = { Text("✍️") },
                                            label = { Text("Practice") }
                                        )
                                        NavigationBarItem(
                                            selected = currentNavTab == 4,
                                            onClick = { currentNavTab = 4 },
                                            icon = { Text("👤") },
                                            label = { Text("Profile") }
                                        )
                                    }
                                }
                            ) { paddingValues ->
                                Box(modifier = Modifier.padding(paddingValues)) {
                                    when (currentNavTab) {
                                        0 -> DashboardScreen(
                                            userProfile = userProfile,
                                            todaySchedule = repository.getTodaySchedule(),
                                            allSchedules = schedules,
                                            onStartStudy = { item ->
                                                activeTimerSession = Triple(item.subject, item.chapterTitle, item.estimatedMinutes)
                                            },
                                            onNavigateToBooks = { currentNavTab = 1 },
                                            onNavigateToCalendar = { currentNavTab = 2 },
                                            onNavigateToPractice = { currentNavTab = 3 }
                                        )
                                        1 -> BooksScreen(
                                            subjects = subjects,
                                            onChapterSelected = { subj, ch ->
                                                selectedChapterSubject = Pair(subj, ch)
                                            }
                                        )
                                        2 -> CalendarScreen(
                                            schedules = schedules,
                                            onUpdateSchedule = { updatedItem ->
                                                repository.updateScheduleItem(updatedItem)
                                                schedules = repository.getAllSchedules()
                                                if (updatedItem.alarmEnabled) {
                                                    alarmScheduler.scheduleStudyAlarm(updatedItem, userProfile.fullName)
                                                } else {
                                                    alarmScheduler.cancelAlarm(updatedItem.dayIndex)
                                                }
                                            },
                                            onStartStudy = { item ->
                                                activeTimerSession = Triple(item.subject, item.chapterTitle, item.estimatedMinutes)
                                            }
                                        )
                                        3 -> PracticeScreen(
                                            subjects = subjects,
                                            mistakes = mistakes,
                                            onAddMistake = { mistake ->
                                                repository.addMistake(mistake)
                                                mistakes = repository.getAllMistakes()
                                            }
                                        )
                                        4 -> ProfileScreen(
                                            userProfile = userProfile,
                                            isDarkMode = isDarkMode,
                                            onToggleDarkMode = { isDarkMode = it },
                                            onLanguageChanged = { lang ->
                                                val updated = userProfile.copy(preferredLanguage = lang)
                                                repository.saveUserProfile(updated)
                                                userProfile = updated
                                            },
                                            onResetData = {
                                                repository.resetAllData()
                                                isOnboarded = false
                                                welcomePassed = false
                                                schedules = repository.getAllSchedules()
                                                mistakes = emptyList()
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private fun checkAndRequestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }
}
