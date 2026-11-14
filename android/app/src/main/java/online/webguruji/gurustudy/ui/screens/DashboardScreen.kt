package online.webguruji.gurustudy.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import online.webguruji.gurustudy.data.model.PlanStatusInfo
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.StudySlotItem
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import online.webguruji.gurustudy.ui.theme.RoyalBlueLight
import online.webguruji.gurustudy.ui.theme.SkyBlue
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    userProfile: UserProfile,
    currentSchedule: StudyScheduleItem?,
    allSchedules: List<StudyScheduleItem>,
    planStatus: PlanStatusInfo,
    selectedDayIndex: Int,
    onSelectDay: (Int) -> Unit,
    onStartStudy: (String, String, Int) -> Unit,
    onToggleSlotComplete: (Int, Int, Boolean) -> Unit,
    onToggleDayComplete: (Int, Boolean) -> Unit,
    onNavigateToBooks: () -> Unit,
    onNavigateToCalendar: () -> Unit,
    onNavigateToPractice: () -> Unit,
    onTestAlarm: (StudyScheduleItem) -> Unit,
    onNavigateToAlarmCenter: () -> Unit = {}
) {
    val completedCount = allSchedules.count { it.status == "Completed" }
    val totalCount = if (allSchedules.isEmpty()) 93 else allSchedules.size
    val progressPct = (completedCount.toFloat() / totalCount.toFloat() * 100).toInt()

    val currentDateStr = SimpleDateFormat("EEEE, dd MMMM yyyy", Locale.getDefault()).format(Date())

    val schedule = currentSchedule ?: allSchedules.firstOrNull()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // 1. Personalized Greeting Header Card
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent),
            modifier = Modifier.fillMaxWidth()
        ) {
            Box(
                modifier = Modifier
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(RoyalBlue, RoyalBlueLight)
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
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Namaste, ${userProfile.fullName.ifBlank { "Student" }}! 🙏",
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = currentDateStr,
                                fontSize = 12.sp,
                                color = Color(0xFFBAE6FD)
                            )
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
                                Text(text = "🔥", fontSize = 14.sp)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "${userProfile.studyStreak} Day Streak",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0x26FFFFFF)
                    ) {
                        Text(
                            text = "CBSE Class 10 Session 2026–2027 • 93-Day Board Exam Preparation",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFFF1F5F9),
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
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

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    if (planStatus.dayIndex != selectedDayIndex) {
                        OutlinedButton(
                            onClick = { onSelectDay(planStatus.dayIndex) },
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text("📍 Jump to Today's Day", fontSize = 12.sp)
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
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // 3. Progress Overview Card
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
                    Column {
                        Text(
                            text = "Syllabus Completion",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "Daily Goal: ${userProfile.dailyStudyGoalMinutes} min (4 hours)",
                            fontSize = 12.sp,
                            color = Color(0xFF64748B)
                        )
                    }

                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFEFF6FF),
                        border = BorderStroke(2.dp, RoyalBlue),
                        modifier = Modifier.size(54.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "$progressPct%",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = RoyalBlue
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                LinearProgressIndicator(
                    progress = { completedCount.toFloat() / totalCount.toFloat() },
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
                        text = "✅ Completed: $completedCount / $totalCount Days",
                        fontSize = 12.sp,
                        color = Color(0xFF16A34A),
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "⏳ Remaining: ${totalCount - completedCount} Days",
                        fontSize = 12.sp,
                        color = Color(0xFFD97706),
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // 4. Sunday Backlog Buffer Section (If Sunday)
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
                                text = "Review unfinished targets from the past 6 days. Catch-up time is never double-counted.",
                                fontSize = 12.sp,
                                color = Color(0xFFB45309)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

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
                                text = "🎉 Outstanding! All targets from the past 6 days are completed! Use today for weak-topic revision, formula sheets, or mock tests.",
                                fontSize = 13.sp,
                                color = Color(0xFF16A34A),
                                fontWeight = FontWeight.Medium,
                                modifier = Modifier.padding(12.dp)
                            )
                        }
                    } else {
                        Text(
                            text = "Pending Targets to Clear (${pendingBacklogs.size} items):",
                            fontSize = 13.sp,
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
                                    modifier = Modifier.weight(1f)
                                )
                                OutlinedButton(
                                    onClick = { onToggleDayComplete(backlog.dayIndex, true) },
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text("Mark Done", fontSize = 10.sp)
                                }
                            }
                        }
                    }
                }
            }
            Spacer(modifier = Modifier.height(18.dp))
        }

        // 5. Today's Four Study Sessions (Daily 4-Hour Routine)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Daily 4-Hour Routine",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            if (schedule != null) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (schedule.status == "Completed") Color(0xFFDCFCE7) else Color(0xFFEFF6FF)
                ) {
                    Text(
                        text = if (schedule.status == "Completed") "✓ Day Completed" else "Total 240 Mins",
                        color = if (schedule.status == "Completed") Color(0xFF16A34A) else RoyalBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
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
                    fontSize = 13.sp,
                    color = Color(0xFF64748B)
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
                        color = Color.White
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 6. Quick Access
        Text(
            text = "Quick Access & Tools",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            QuickCard(
                title = "NCERT Library",
                subtitle = "All 6 Subjects",
                icon = "📚",
                color = Color(0xFF3B82F6),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToBooks
            )
            QuickCard(
                title = "Study Calendar",
                subtitle = "93 Days Plan",
                icon = "📅",
                color = Color(0xFF10B981),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToCalendar
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            QuickCard(
                title = "Practice Centre",
                subtitle = "MCQs & Quizzes",
                icon = "✍️",
                color = Color(0xFF8B5CF6),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToPractice
            )
            QuickCard(
                title = "Smart Alarms",
                subtitle = "Reminders & Overlay",
                icon = "⏰",
                color = Color(0xFFF59E0B),
                modifier = Modifier.weight(1f),
                onClick = onNavigateToAlarmCenter
            )
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}

@Composable
fun SessionSlotCard(
    slotIndex: Int,
    slot: StudySlotItem,
    dayIndex: Int,
    onStartSession: () -> Unit,
    onToggleComplete: (Boolean) -> Unit
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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(icon, fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = slot.subject,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = badgeColor
                    )
                }

                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = Color(0xFFF1F5F9)
                ) {
                    Text(
                        text = slot.time.ifBlank { "${slot.scheduledTime} • ${slot.durationMinutes} min" },
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF475569),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = slot.topic.ifBlank { slot.target },
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )

            if (slot.target.isNotBlank() && slot.target != slot.topic) {
                Text(
                    text = slot.target,
                    fontSize = 12.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(top = 2.dp)
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
                    modifier = Modifier.clickable { onToggleComplete(!slot.completed) }
                ) {
                    Checkbox(
                        checked = slot.completed,
                        onCheckedChange = { onToggleComplete(it) }
                    )
                    Text(
                        text = if (slot.completed) "Completed" else "Mark Done",
                        fontSize = 12.sp,
                        color = if (slot.completed) Color(0xFF16A34A) else Color(0xFF64748B),
                        fontWeight = if (slot.completed) FontWeight.Bold else FontWeight.Normal
                    )
                }

                Button(
                    onClick = onStartSession,
                    colors = ButtonDefaults.buttonColors(containerColor = badgeColor),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text("▶ Start (${slot.durationMinutes}m)", fontSize = 12.sp, color = Color.White)
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
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = CircleShape,
                color = color.copy(alpha = 0.15f),
                modifier = Modifier.size(46.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(text = icon, fontSize = 22.sp)
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = Color(0xFF64748B)
                )
            }
        }
    }
}

