package online.webguruji.gurustudy.ui.screens

import android.app.TimePickerDialog
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.model.PlanStatusInfo
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.StudySlotItem
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import online.webguruji.gurustudy.ui.theme.RoyalBlueLight
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun DashboardScreen(
    userProfile: UserProfile,
    currentSchedule: StudyScheduleItem?,
    allSchedules: List<StudyScheduleItem>,
    planStatus: PlanStatusInfo,
    selectedDayIndex: Int,
    subjects: List<NcertSubject> = emptyList(),
    onSelectDay: (Int) -> Unit,
    onStartStudy: (String, String, Int) -> Unit,
    onToggleSlotComplete: (Int, Int, Boolean) -> Unit,
    onToggleDayComplete: (Int, Boolean) -> Unit,
    onNavigateToBooks: () -> Unit,
    onNavigateToCalendar: () -> Unit,
    onNavigateToPractice: () -> Unit,
    onTestAlarm: (StudyScheduleItem) -> Unit,
    onNavigateToAlarmCenter: () -> Unit = {},
    onNavigateToProfile: () -> Unit = {},
    onAcceptAdaptiveReschedule: (() -> Unit)? = null
) {
    val context = LocalContext.current
    val repository = remember { StudyRepository(context) }

    val completedCount = allSchedules.count { it.status == "Completed" }
    val totalCount = if (allSchedules.isEmpty()) 93 else allSchedules.size
    val progressPct = (completedCount.toFloat() / totalCount.toFloat() * 100).toInt()

    val currentDateStr = SimpleDateFormat("EEEE, dd MMMM yyyy", Locale.getDefault()).format(Date())
    val schedule = currentSchedule ?: allSchedules.firstOrNull()

    val lastReadSubj = repository.getLastReadSubject()
    val lastReadCh = repository.getLastReadChapter()
    val allMistakes = remember { repository.getAllMistakes() }

    // Dashboard Customization States
    var showCustomizeModal by remember { mutableStateOf(false) }
    var dashContinueVisible by remember { mutableStateOf(repository.isDashContinueVisible()) }
    var dashAlarmsVisible by remember { mutableStateOf(repository.isDashAlarmsVisible()) }
    var dashWeeklyVisible by remember { mutableStateOf(repository.isDashWeeklyVisible()) }
    var dashWeakChVisible by remember { mutableStateOf(repository.isDashWeakChVisible()) }
    var dashAchieveVisible by remember { mutableStateOf(repository.isDashAchieveVisible()) }

    // Reschedule Slot Time Picker State
    var slotToReschedule by remember { mutableStateOf<Pair<Int, StudySlotItem>?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // 1. Welcome Header Card
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent),
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                modifier = Modifier
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(RoyalBlue, Color(0xFF2563EB))
                        )
                    )
                    .padding(20.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f).padding(end = 8.dp)
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = Color(0x33FFFFFF),
                                modifier = Modifier
                                    .size(46.dp)
                                    .clickable { onNavigateToProfile() }
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = userProfile.fullName.take(1).uppercase().ifBlank { "S" },
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 20.sp
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Namaste, ${userProfile.fullName.ifBlank { "Student" }}! 🙏",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    softWrap = true
                                )
                                Text(
                                    text = currentDateStr,
                                    fontSize = 11.sp,
                                    color = Color(0xFFBAE6FD)
                                )
                            }
                        }

                        // Streak Pill
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = Color(0x33FFFFFF)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = "🔥", fontSize = 13.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "${userProfile.studyStreak}d Streak",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    maxLines = 1,
                                    softWrap = false
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0x26FFFFFF),
                            modifier = Modifier.weight(1f, fill = false).padding(end = 8.dp)
                        ) {
                            Text(
                                text = "Class 10 CBSE (2026–2027) • ${planStatus.phaseName}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFFF1F5F9),
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                softWrap = true
                            )
                        }

                        IconButton(
                            onClick = { showCustomizeModal = true },
                            modifier = Modifier.size(28.dp)
                        ) {
                            Text("⚙️", fontSize = 14.sp)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 2. Day Navigator Bar (All 93 Days)
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { if (selectedDayIndex > 1) onSelectDay(selectedDayIndex - 1) },
                        enabled = selectedDayIndex > 1
                    ) {
                        Text("◀", fontSize = 18.sp, color = if (selectedDayIndex > 1) RoyalBlue else Color.Gray)
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Day $selectedDayIndex of 93",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        if (schedule != null) {
                            Text(
                                text = "${schedule.date} (${schedule.dayOfWeek})",
                                fontSize = 12.sp,
                                color = Color(0xFF64748B)
                            )
                        }
                    }

                    IconButton(
                        onClick = { if (selectedDayIndex < 93) onSelectDay(selectedDayIndex + 1) },
                        enabled = selectedDayIndex < 93
                    ) {
                        Text("▶", fontSize = 18.sp, color = if (selectedDayIndex < 93) RoyalBlue else Color.Gray)
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                FlowRow(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (planStatus.dayIndex != selectedDayIndex) {
                        OutlinedButton(
                            onClick = { onSelectDay(planStatus.dayIndex) },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text("📍 Jump to Today's Day", fontSize = 12.sp, maxLines = 1, softWrap = false)
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFEFF6FF)
                    ) {
                        Text(
                            text = planStatus.message,
                            fontSize = 11.sp,
                            color = RoyalBlue,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            softWrap = false,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 3. Today's Study Overview Card
        if (schedule != null) {
            val slots = if (schedule.slots.isNotEmpty()) schedule.slots else getDefaultSlotsForSchedule(schedule)
            val isSunday = schedule.dayOfWeek.equals("Sunday", ignoreCase = true) || schedule.isSunday
            val plannedMinutes = if (isSunday) 390 else 300
            val plannedHoursText = if (isSunday) "6.5h" else "5h"
            val completedMinutes = slots.filter { it.completed }.sumOf { it.durationMinutes }
            val remainingMinutes = (plannedMinutes - completedMinutes).coerceAtLeast(0)
            val doneTasks = slots.count { it.completed }
            val pendingTasks = slots.size - doneTasks

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
                            Text(
                                text = "Today's Study Overview",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                            Text(
                                text = "Target: $plannedMinutes min ($plannedHoursText) • Done: $completedMinutes min",
                                fontSize = 12.sp,
                                color = Color(0xFF64748B)
                            )
                        }

                        Surface(
                            shape = CircleShape,
                            color = Color(0xFFEFF6FF),
                            border = BorderStroke(2.dp, RoyalBlue),
                            modifier = Modifier.size(52.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                val dailyPct = ((completedMinutes.toFloat() / plannedMinutes.toFloat()) * 100).toInt()
                                Text(
                                    text = "$dailyPct%",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = RoyalBlue,
                                    maxLines = 1,
                                    softWrap = false
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    LinearProgressIndicator(
                        progress = { completedMinutes.toFloat() / plannedMinutes.toFloat() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp),
                        color = RoyalBlue,
                        trackColor = Color(0xFFE2E8F0),
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "✓ Tasks Done: $doneTasks / ${slots.size}",
                            fontSize = 12.sp,
                            color = Color(0xFF16A34A),
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.weight(1f, fill = false).padding(end = 6.dp)
                        )
                        Text(
                            text = "⏳ Left: $remainingMinutes mins ($pendingTasks tasks)",
                            fontSize = 12.sp,
                            color = Color(0xFFD97706),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
        }

        // 4. Continue Studying Card (If Enabled & Last Read Available)
        if (dashContinueVisible && lastReadCh.isNotBlank()) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.dp, Color(0xFFDBEAFE)),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f).padding(end = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFFEFF6FF),
                            modifier = Modifier.size(42.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("📖", fontSize = 18.sp)
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "Continue Studying",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = RoyalBlue
                            )
                            Text(
                                text = lastReadCh,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface,
                                softWrap = true
                            )
                            Text(
                                text = "$lastReadSubj • NCERT Class 10",
                                fontSize = 11.sp,
                                color = Color(0xFF64748B)
                            )
                        }
                    }

                    Button(
                        onClick = { onStartStudy(lastReadSubj, lastReadCh, 45) },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text("Resume", fontSize = 12.sp, color = Color.White, maxLines = 1, softWrap = false)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
        }

        // 5. Sunday Backlog Buffer Section (If Sunday)
        if (schedule != null && (schedule.isSunday || schedule.dayOfWeek.equals("Sunday", ignoreCase = true))) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7)),
                border = BorderStroke(1.dp, Color(0xFFF59E0B)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("📅 ", fontSize = 20.sp)
                        Column {
                            Text(
                                text = "Sunday Backlog & Catch-Up Buffer",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF92400E)
                            )
                            Text(
                                text = "Review unfinished targets from past 6 days. Never counted twice.",
                                fontSize = 12.sp,
                                color = Color(0xFFB45309)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    val prevDaysStart = (selectedDayIndex - 6).coerceAtLeast(1)
                    val pendingBacklogs = allSchedules.filter {
                        it.dayIndex in prevDaysStart until selectedDayIndex && it.status != "Completed"
                    }

                    if (pendingBacklogs.isEmpty()) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFDCFCE7),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "🎉 All past 6 days completed! Use today for weak-topic revision, formula sheets, or mock tests.",
                                fontSize = 12.sp,
                                color = Color(0xFF16A34A),
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(12.dp)
                            )
                        }
                    } else {
                        Text(
                            text = "Pending Targets to Clear (${pendingBacklogs.size} items):",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF92400E)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        pendingBacklogs.forEach { backlog ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 3.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "• Day ${backlog.dayIndex}: ${backlog.subject} - ${backlog.chapterTitle}",
                                    fontSize = 12.sp,
                                    color = Color(0xFF78350F),
                                    modifier = Modifier.weight(1f).padding(end = 8.dp),
                                    softWrap = true
                                )
                                OutlinedButton(
                                    onClick = { onToggleDayComplete(backlog.dayIndex, true) },
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text("Mark Done", fontSize = 11.sp, maxLines = 1, softWrap = false)
                                }
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
        }

        // 6. Today's Four Study Sessions (Daily 4-Hour Routine)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Today's Schedule (4-Hour Routine)",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                modifier = Modifier.weight(1f).padding(end = 8.dp),
                softWrap = true
            )

            if (schedule != null) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (schedule.status == "Completed") Color(0xFFDCFCE7) else Color(0xFFEFF6FF)
                ) {
                    Text(
                        text = if (schedule.status == "Completed") "✓ Day Done" else "4 Slots",
                        color = if (schedule.status == "Completed") Color(0xFF16A34A) else RoyalBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                        maxLines = 1,
                        softWrap = false
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        if (schedule != null) {
            val slots = if (schedule.slots.isNotEmpty()) schedule.slots else getDefaultSlotsForSchedule(schedule)

            slots.forEachIndexed { index, slot ->
                SessionSlotCard(
                    slotIndex = index,
                    slot = slot,
                    dayIndex = schedule.dayIndex,
                    onStartSession = {
                        onStartStudy(slot.subject, slot.topic.ifBlank { schedule.chapterTitle }, slot.durationMinutes)
                    },
                    onToggleComplete = { completed ->
                        onToggleSlotComplete(schedule.dayIndex, index, completed)
                    },
                    onRescheduleTime = {
                        slotToReschedule = Pair(index, slot)
                    }
                )
                Spacer(modifier = Modifier.height(10.dp))
            }

            // Quick Mark Whole Day as Completed Button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "All 4 sessions done for Day ${schedule.dayIndex}?",
                    fontSize = 12.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.weight(1f).padding(end = 8.dp),
                    softWrap = true
                )
                Button(
                    onClick = {
                        val newStatus = if (schedule.status == "Completed") "Pending" else "Completed"
                        onToggleDayComplete(schedule.dayIndex, newStatus == "Completed")
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (schedule.status == "Completed") Color(0xFF16A34A) else RoyalBlue
                    ),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = if (schedule.status == "Completed") "✓ Completed" else "Mark Day Done",
                        fontSize = 12.sp,
                        color = Color.White,
                        maxLines = 1,
                        softWrap = false
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 7. All 6 Subjects Progress Section
        if (subjects.isNotEmpty()) {
            Text(
                text = "My Subject Progress (All 6 Subjects)",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(subjects) { subj ->
                    val allChapters = subj.books.flatMap { it.chapters }
                    val doneCount = allChapters.count { it.safeStatus == "Completed" }
                    val totalChapters = allChapters.size.coerceAtLeast(1)
                    val subjPct = ((doneCount.toFloat() / totalChapters.toFloat()) * 100).toInt()

                    Card(
                        onClick = onNavigateToBooks,
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.width(160.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(subj.icon, fontSize = 20.sp)
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = Color(0xFFEFF6FF)
                                ) {
                                    Text(
                                        text = "$subjPct%",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = RoyalBlue,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = subj.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                maxLines = 1
                            )
                            Text(
                                text = "$doneCount / $totalChapters chapters",
                                fontSize = 11.sp,
                                color = Color(0xFF64748B)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            LinearProgressIndicator(
                                progress = { doneCount.toFloat() / totalChapters.toFloat() },
                                modifier = Modifier.fillMaxWidth().height(5.dp),
                                color = RoyalBlue,
                                trackColor = Color(0xFFE2E8F0)
                            )
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
        }

        // 8. Weekly Study Summary Widget (If Enabled)
        if (dashWeeklyVisible) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "📊 Weekly Study Consistency",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "Last 7 days study completion track",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.Bottom
                    ) {
                        val recentDays = allSchedules.take(selectedDayIndex).takeLast(7)
                        recentDays.forEach { d ->
                            val isDone = d.status == "Completed"
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Bottom
                            ) {
                                Box(
                                    modifier = Modifier
                                        .width(28.dp)
                                        .height(if (isDone) 50.dp else 22.dp)
                                        .background(
                                            color = if (isDone) RoyalBlue else Color(0xFFE2E8F0),
                                            shape = RoundedCornerShape(6.dp)
                                        )
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = d.dayOfWeek.take(3),
                                    fontSize = 10.sp,
                                    color = Color(0xFF64748B),
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // 9. Weak Chapters Widget (If Enabled & Mistakes Exist)
        if (dashWeakChVisible && allMistakes.isNotEmpty()) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF1F2)),
                border = BorderStroke(1.dp, Color(0xFFFECDD3)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    FlowRow(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Text("🎯 ", fontSize = 16.sp)
                            Text(
                                text = "Focus & Weak Spot Remediation",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = Color(0xFF9F1239),
                                softWrap = true
                            )
                        }
                        OutlinedButton(
                            onClick = onNavigateToPractice,
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Review All", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, maxLines = 1, softWrap = false)
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Chapters with recorded mistakes needing revision before board exams:",
                        fontSize = 11.sp,
                        color = Color(0xFF881337)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    val topMistakeChapters = allMistakes.groupBy { "${it.subjectName}: ${it.chapterTitle}" }
                        .toList()
                        .sortedByDescending { it.second.size }
                        .take(3)

                    topMistakeChapters.forEach { (title, list) ->
                        Text(
                            text = "• $title (${list.size} recorded errors)",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFFBE123C)
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // 10. Real Activity Achievements (If Enabled)
        if (dashAchieveVisible) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "🏆 Real Milestones & Achievements",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Text(
                        text = "Earned through actual study progress (Never fabricated)",
                        fontSize = 11.sp,
                        color = Color(0xFF64748B)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFEFF6FF),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text("🎓", fontSize = 18.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Board Aspirant", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = RoyalBlue)
                                Text("Enrolled 2026-27", fontSize = 10.sp, color = Color(0xFF64748B))
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (userProfile.studyStreak >= 3) Color(0xFFDCFCE7) else Color(0xFFF1F5F9),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text(if (userProfile.studyStreak >= 3) "🔥" else "🔒", fontSize = 18.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (userProfile.studyStreak >= 3) "Streak Master" else "3-Day Streak",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (userProfile.studyStreak >= 3) Color(0xFF16A34A) else Color(0xFF94A3B8)
                                )
                                Text(
                                    text = if (userProfile.studyStreak >= 3) "${userProfile.studyStreak} days active" else "Need 3 days",
                                    fontSize = 10.sp,
                                    color = Color(0xFF64748B)
                                )
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = if (completedCount >= 10) Color(0xFFFEF3C7) else Color(0xFFF1F5F9),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Text(if (completedCount >= 10) "⭐" else "🔒", fontSize = 18.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = if (completedCount >= 10) "10 Days Done" else "Phase 1 Star",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (completedCount >= 10) Color(0xFFD97706) else Color(0xFF94A3B8)
                                )
                                Text(
                                    text = "$completedCount / 10 done",
                                    fontSize = 10.sp,
                                    color = Color(0xFF64748B)
                                )
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        // 11. Quick Access Tools Grid
        Text(
            text = "Quick Tools & Navigation",
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            QuickCard(
                title = "NCERT Books",
                subtitle = "All 6 Subjects",
                icon = "📚",
                color = Color(0xFF3B82F6),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToBooks
            )
            QuickCard(
                title = "Study Plan",
                subtitle = "93 Days Plan",
                icon = "📅",
                color = Color(0xFF10B981),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToCalendar
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            QuickCard(
                title = "Practice Center",
                subtitle = "MCQs & Quizzes",
                icon = "✍️",
                color = Color(0xFF8B5CF6),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToPractice
            )
            QuickCard(
                title = "Smart Alarms",
                subtitle = "Alarms & Overlays",
                icon = "⏰",
                color = Color(0xFFF59E0B),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToAlarmCenter
            )
        }

        Spacer(modifier = Modifier.height(30.dp))
    }

    // Dashboard Customization Modal
    if (showCustomizeModal) {
        AlertDialog(
            onDismissRequest = { showCustomizeModal = false },
            title = { Text("Customize Dashboard Widgets", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("Select which educational widgets appear on your main dashboard:", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Continue Studying Card", fontSize = 13.sp, modifier = Modifier.weight(1f).padding(end = 8.dp))
                        Switch(checked = dashContinueVisible, onCheckedChange = {
                            dashContinueVisible = it
                            repository.setDashContinueVisible(it)
                        })
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Weekly Consistency Chart", fontSize = 13.sp, modifier = Modifier.weight(1f).padding(end = 8.dp))
                        Switch(checked = dashWeeklyVisible, onCheckedChange = {
                            dashWeeklyVisible = it
                            repository.setDashWeeklyVisible(it)
                        })
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Weak Chapters & Remediation", fontSize = 13.sp, modifier = Modifier.weight(1f).padding(end = 8.dp))
                        Switch(checked = dashWeakChVisible, onCheckedChange = {
                            dashWeakChVisible = it
                            repository.setDashWeakChVisible(it)
                        })
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Real Achievements", fontSize = 13.sp, modifier = Modifier.weight(1f).padding(end = 8.dp))
                        Switch(checked = dashAchieveVisible, onCheckedChange = {
                            dashAchieveVisible = it
                            repository.setDashAchieveVisible(it)
                        })
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = { showCustomizeModal = false },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                ) {
                    Text("Done", color = Color.White)
                }
            }
        )
    }

    // Reschedule Slot Time Dialog
    if (slotToReschedule != null) {
        val (slotIdx, slot) = slotToReschedule!!
        val parts = slot.scheduledTime.split(":")
        val h = parts.getOrNull(0)?.toIntOrNull() ?: 6
        val m = parts.getOrNull(1)?.toIntOrNull() ?: 0

        TimePickerDialog(
            context,
            { _, hourOfDay, minute ->
                val newTime = String.format("%02d:%02d", hourOfDay, minute)
                slot.scheduledTime = newTime
                if (schedule != null) {
                    repository.updateScheduleItem(schedule)
                }
                slotToReschedule = null
            },
            h, m, false
        ).show()
    }
}

@Composable
fun SessionSlotCard(
    slotIndex: Int,
    slot: StudySlotItem,
    dayIndex: Int,
    onStartSession: () -> Unit,
    onToggleComplete: (Boolean) -> Unit,
    onRescheduleTime: (() -> Unit)? = null
) {
    val (icon, badgeColor) = when (slot.subject.lowercase()) {
        "mathematics" -> Pair("📐", Color(0xFF2563EB))
        "science" -> Pair("🔬", Color(0xFF16A34A))
        "social science" -> Pair("🌍", Color(0xFFD97706))
        "english" -> Pair("📖", Color(0xFF9333EA))
        else -> Pair("📝", RoyalBlue)
    }

    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier.weight(1f).padding(end = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(icon, fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = slot.subject,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = badgeColor,
                        maxLines = 1,
                        softWrap = false
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Color(0xFFF1F5F9),
                        modifier = Modifier.clickable { onRescheduleTime?.invoke() }
                    ) {
                        Text(
                            text = "${slot.scheduledTime} • ${slot.durationMinutes}m ✏️",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF475569),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                            maxLines = 1,
                            softWrap = false
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = slot.topic.ifBlank { slot.target },
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface,
                softWrap = true
            )

            if (slot.target.isNotBlank() && slot.target != slot.topic) {
                Text(
                    text = slot.target,
                    fontSize = 12.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(top = 2.dp),
                    softWrap = true
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f).padding(end = 8.dp).clickable { onToggleComplete(!slot.completed) }
                ) {
                    Checkbox(
                        checked = slot.completed,
                        onCheckedChange = { onToggleComplete(it) }
                    )
                    Text(
                        text = if (slot.completed) "Completed" else "Mark Done",
                        fontSize = 12.sp,
                        color = if (slot.completed) Color(0xFF16A34A) else Color(0xFF64748B),
                        fontWeight = if (slot.completed) FontWeight.Bold else FontWeight.Normal,
                        maxLines = 1,
                        softWrap = false
                    )
                }

                Button(
                    onClick = onStartSession,
                    colors = ButtonDefaults.buttonColors(containerColor = badgeColor),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text("▶ Start (${slot.durationMinutes}m)", fontSize = 12.sp, color = Color.White, maxLines = 1, softWrap = false)
                }
            }
        }
    }
}

fun getDefaultSlotsForSchedule(schedule: StudyScheduleItem): List<StudySlotItem> {
    return listOf(
        StudySlotItem(
            id = "slot_1",
            subject = "Mathematics",
            time = "06:00–07:30 AM",
            durationMinutes = 90,
            topic = "Core Math Concept & Problem Practice",
            target = schedule.learningTarget.ifBlank { "Solve NCERT exercise questions" },
            scheduledTime = "06:00"
        ),
        StudySlotItem(
            id = "slot_2",
            subject = "Science",
            time = "05:30–06:30 PM",
            durationMinutes = 60,
            topic = "Theory, Equations & Diagram Analysis",
            target = "Read NCERT theory & definitions",
            scheduledTime = "17:30"
        ),
        StudySlotItem(
            id = "slot_3",
            subject = "Social Science",
            time = "07:00–08:00 PM",
            durationMinutes = 60,
            topic = "Case studies, Dates & Map Work",
            target = "Key events, definitions and map locations",
            scheduledTime = "19:00"
        ),
        StudySlotItem(
            id = "slot_4",
            subject = "English",
            time = "08:30–09:00 PM",
            durationMinutes = 30,
            topic = "Literature, Analytical Paragraph & Grammar",
            target = "Chapter reading & grammar practice",
            scheduledTime = "20:30"
        )
    )
}

@Composable
fun QuickCard(
    title: String,
    subtitle: String,
    icon: String,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = CircleShape,
                color = color.copy(alpha = 0.15f),
                modifier = Modifier.size(44.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(text = icon, fontSize = 20.sp)
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 1,
                    softWrap = false
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = Color(0xFF64748B),
                    maxLines = 1,
                    softWrap = false
                )
            }
        }
    }
}
