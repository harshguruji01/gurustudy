package online.webguruji.gurustudy

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
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
            var isDarkMode by remember { mutableStateOf<Boolean>(repository.isDarkMode()) }
            var accentColor by remember { mutableStateOf<String>(repository.getAccentColor()) }
            var userProfile by remember { mutableStateOf(repository.getUserProfile()) }
            var isOnboarded by remember { mutableStateOf(repository.isOnboarded()) }
            var welcomePassed by remember { mutableStateOf(isOnboarded) }

            var currentNavTab by remember { mutableIntStateOf(0) } // 0: Home, 1: Books, 2: Calendar, 3: Practice, 4: Profile
            var showAlarmCenter by remember { mutableStateOf(false) }
            var selectedChapterSubject by remember { mutableStateOf<Pair<NcertSubject, NcertChapter>?>(null) }
            var activeTimerSession by remember {
                mutableStateOf(
                    if (navigateTo == "STUDY_TIMER") Triple(alarmSubj, alarmCh, alarmDur) else null
                )
            }

            var schedules by remember { mutableStateOf(repository.getAllSchedules()) }
            val subjects by remember { mutableStateOf(repository.getSubjects()) }
            var mistakes by remember { mutableStateOf(repository.getAllMistakes()) }

            val planStatus = remember(schedules) { repository.getPlanStatus() }
            var selectedDayIndex by remember { mutableIntStateOf(planStatus.dayIndex) }

            GuruStudyTheme(darkTheme = isDarkMode, accent = accentColor) {
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
                                    // Mark current schedule completed
                                    val currentDay = repository.getScheduleForDay(selectedDayIndex)
                                    if (currentDay != null) {
                                        repository.updateScheduleStatus(currentDay.dayIndex, "Completed")
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

                        // Flow 5: Smart Alarm & Overlay Center
                        showAlarmCenter -> {
                            AlarmCenterScreen(
                                userProfile = userProfile,
                                allSchedules = schedules,
                                onBackClicked = { showAlarmCenter = false },
                                onLanguageChanged = { lang ->
                                    val updated = userProfile.copy(preferredLanguage = lang)
                                    repository.saveUserProfile(updated)
                                    userProfile = updated
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
                                        0 -> {
                                            val currentItem = schedules.find { it.dayIndex == selectedDayIndex }
                                                ?: schedules.firstOrNull()

                                            DashboardScreen(
                                                userProfile = userProfile,
                                                currentSchedule = currentItem,
                                                allSchedules = schedules,
                                                planStatus = planStatus,
                                                selectedDayIndex = selectedDayIndex,
                                                subjects = subjects,
                                                onSelectDay = { selectedDayIndex = it },
                                                onStartStudy = { subject, chapter, duration ->
                                                    activeTimerSession = Triple(subject, chapter, duration)
                                                },
                                                onToggleSlotComplete = { dayIndex, slotIndex, completed ->
                                                    val item = schedules.find { it.dayIndex == dayIndex }
                                                    if (item != null && slotIndex < item.slots.size) {
                                                        item.slots[slotIndex].completed = completed
                                                        val allSlotsDone = item.slots.all { it.completed }
                                                        if (allSlotsDone) {
                                                            item.status = "Completed"
                                                        }
                                                        repository.updateScheduleItem(item)
                                                        schedules = repository.getAllSchedules()
                                                    }
                                                },
                                                onToggleDayComplete = { dayIndex, completed ->
                                                    repository.updateScheduleStatus(dayIndex, if (completed) "Completed" else "Pending")
                                                    schedules = repository.getAllSchedules()
                                                },
                                                onNavigateToBooks = { currentNavTab = 1 },
                                                onNavigateToCalendar = { currentNavTab = 2 },
                                                onNavigateToPractice = { currentNavTab = 3 },
                                                onNavigateToProfile = { currentNavTab = 4 },
                                                onTestAlarm = { scheduleItem ->
                                                    alarmScheduler.scheduleStudyAlarm(scheduleItem, userProfile.fullName)
                                                    Toast.makeText(
                                                        this@MainActivity,
                                                        "🔔 Test Alarm scheduled for ${scheduleItem.subject}! Starting in 5 seconds...",
                                                        Toast.LENGTH_LONG
                                                    ).show()
                                                },
                                                onNavigateToAlarmCenter = { showAlarmCenter = true }
                                            )
                                        }
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
                                            onToggleDarkMode = {
                                                isDarkMode = it
                                                repository.setDarkMode(it)
                                            },
                                            onLanguageChanged = { lang ->
                                                val updated = userProfile.copy(preferredLanguage = lang)
                                                repository.saveUserProfile(updated)
                                                repository.setLanguage(lang)
                                                userProfile = updated
                                            },
                                            onSaveProfile = { updated ->
                                                repository.saveUserProfile(updated)
                                                userProfile = updated
                                                accentColor = repository.getAccentColor()
                                                Toast.makeText(this@MainActivity, "Profile updated successfully!", Toast.LENGTH_SHORT).show()
                                            },
                                            onResetData = {
                                                repository.resetAllData()
                                                isOnboarded = false
                                                welcomePassed = false
                                                schedules = repository.getAllSchedules()
                                                mistakes = emptyList()
                                            },
                                            onNavigateToAlarmCenter = { showAlarmCenter = true },
                                            onDataRestored = {
                                                userProfile = repository.getUserProfile()
                                                schedules = repository.getAllSchedules()
                                                mistakes = repository.getAllMistakes()
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
