package online.webguruji.gurustudy.ui.screens

import android.app.TimePickerDialog
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun CalendarScreen(
    schedules: List<StudyScheduleItem>,
    onUpdateSchedule: (StudyScheduleItem) -> Unit,
    onStartStudy: (StudyScheduleItem) -> Unit
) {
    val context = LocalContext.current
    var selectedMonthFilter by remember { mutableStateOf("All") } // "All", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027"
    var selectedSubjectFilter by remember { mutableStateOf("All") }
    var editingItem by remember { mutableStateOf<StudyScheduleItem?>(null) }

    // Lock 88-Day Plan Calendar range strictly between 20 Nov 2026 and 15 Feb 2027 (Requirement 3)
    val officialSchedules = remember(schedules) {
        val filtered = schedules.filter { item ->
            item.date >= online.webguruji.gurustudy.data.model.MissionConstants.MISSION_START_DATE &&
            item.date <= online.webguruji.gurustudy.data.model.MissionConstants.MISSION_END_DATE
        }
        if (filtered.isNotEmpty()) filtered else schedules
    }

    // Filter schedules by month and subject
    val filteredSchedules = remember(selectedMonthFilter, selectedSubjectFilter, officialSchedules) {
        officialSchedules.filter { item ->
            val monthMatch = when (selectedMonthFilter) {
                "Nov 2026" -> item.date.startsWith("2026-11")
                "Dec 2026" -> item.date.startsWith("2026-12")
                "Jan 2027" -> item.date.startsWith("2027-01")
                "Feb 2027" -> item.date.startsWith("2027-02")
                else -> true
            }
            val subjMatch = when (selectedSubjectFilter) {
                "All" -> true
                else -> item.subject.contains(selectedSubjectFilter, ignoreCase = true)
            }
            monthMatch && subjMatch
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "88-Day Master Study Plan (2026–27)",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = Color.White
                        )
                        Text(
                            text = "20 Nov 2026 – 15 Feb 2027 • 3 Structured Phases",
                            fontSize = 11.sp,
                            color = Color(0xFFBAE6FD)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = RoyalBlue)
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Strict Mission Progress Card (Requirement 3: Compute Days Elapsed and Days Remaining against 2026-11-20 & 2027-02-15)
            val streakInfo = remember { online.webguruji.gurustudy.data.model.MissionEngine.calculateMissionStreak() }
            val completedDays = remember(officialSchedules) { officialSchedules.count { it.status == "Completed" } }
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (streakInfo.phaseState == online.webguruji.gurustudy.data.model.MissionPhaseState.BEFORE_MISSION) {
                                "⏳ Mission Starts in ${streakInfo.daysUntilStart} Days (20 Nov)"
                            } else if (streakInfo.phaseState == online.webguruji.gurustudy.data.model.MissionPhaseState.COMPLETED_MISSION) {
                                "🏆 Mission Completed (88/88 Days)"
                            } else {
                                "🎯 Day ${streakInfo.daysElapsed} of 88 • Active Mission"
                            },
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = RoyalBlue
                        )
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = Color(0xFFEFF6FF)
                        ) {
                            Text(
                                text = "88 Days Total",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = RoyalBlue,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    LinearProgressIndicator(
                        progress = {
                            if (streakInfo.phaseState == online.webguruji.gurustudy.data.model.MissionPhaseState.BEFORE_MISSION) 0f
                            else (streakInfo.daysElapsed.toFloat() / 88f).coerceIn(0f, 1f)
                        },
                        modifier = Modifier.fillMaxWidth().height(6.dp),
                        color = RoyalBlue,
                        trackColor = Color(0xFFE2E8F0)
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Elapsed: ${streakInfo.daysElapsed}d • Remaining: ${streakInfo.daysRemaining}d",
                            fontSize = 11.sp,
                            color = Color(0xFF64748B)
                        )
                        Text(
                            text = "Completed: $completedDays / 88",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF16A34A)
                        )
                    }
                }
            }

            // Month Filter Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                val months = listOf("All (88 Days)", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027")
                items(months) { month ->
                    val isSelected = (month.startsWith("All") && selectedMonthFilter == "All") || month == selectedMonthFilter
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            selectedMonthFilter = if (month.startsWith("All")) "All" else month
                        },
                        label = { Text(month, fontSize = 11.sp) }
                    )
                }
            }

            // Subject Filter Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                val subjs = listOf("All", "Maths", "Science", "Social", "English", "Hindi")
                items(subjs) { subj ->
                    val isSelected = selectedSubjectFilter == subj
                    SuggestionChip(
                        onClick = { selectedSubjectFilter = subj },
                        label = {
                            Text(
                                text = subj,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) RoyalBlue else MaterialTheme.colorScheme.onSurface
                            )
                        },
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            width = if (isSelected) 1.5.dp else 1.dp,
                            color = if (isSelected) RoyalBlue else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
                        )
                    )
                }
            }

            // Days List
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredSchedules) { item ->
                    Card(
                        onClick = { editingItem = item },
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Date Column Badge
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (item.status == "Completed") Color(0xFFDCFCE7) else Color(0xFFEFF6FF),
                                modifier = Modifier.size(54.dp)
                            ) {
                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {
                                    val dayNum = item.date.split("-").getOrElse(2) { "1" }
                                    Text(
                                        text = dayNum,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 18.sp,
                                        color = if (item.status == "Completed") Color(0xFF16A34A) else RoyalBlue
                                    )
                                    Text(
                                        text = item.dayOfWeek.take(3).uppercase(),
                                        fontSize = 9.sp,
                                        color = Color(0xFF64748B)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            // Details
                            Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                                FlowRow(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = Color(0xFFDBEAFE)
                                    ) {
                                        Text(
                                            text = item.subject,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = RoyalBlue,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            maxLines = 1,
                                            softWrap = false
                                        )
                                    }
                                    Text(
                                        text = "Day ${item.dayIndex}",
                                        fontSize = 11.sp,
                                        color = Color(0xFF94A3B8),
                                        maxLines = 1,
                                        softWrap = false
                                    )
                                    if (item.isSunday) {
                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = Color(0xFFFEF3C7)
                                        ) {
                                            Text(
                                                text = "Buffer",
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color(0xFFD97706),
                                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp),
                                                maxLines = 1,
                                                softWrap = false
                                            )
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = item.chapterTitle,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    softWrap = true
                                )

                                Text(
                                    text = "⏱️ ${item.estimatedMinutes}m • ⏰ ${item.scheduledTime}",
                                    fontSize = 11.sp,
                                    color = Color(0xFF64748B)
                                )
                            }

                            // Status / Action
                            Column(horizontalAlignment = Alignment.End) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = if (item.status == "Completed") Color(0xFFDCFCE7) else Color(0xFFFEF3C7)
                                ) {
                                    Text(
                                        text = if (item.status == "Completed") "✓ Done" else "Pending",
                                        color = if (item.status == "Completed") Color(0xFF16A34A) else Color(0xFFD97706),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Medium,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        maxLines = 1,
                                        softWrap = false
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Edit/Reschedule Dialog
    if (editingItem != null) {
        val item = editingItem!!
        var editedDuration by remember { mutableIntStateOf(item.estimatedMinutes) }
        var editedTime by remember { mutableStateOf(item.scheduledTime) }
        var editedStatus by remember { mutableStateOf(item.status) }
        var alarmToggle by remember { mutableStateOf(item.alarmEnabled) }

        val timeParts = editedTime.split(":")
        val initialHour = timeParts.getOrNull(0)?.toIntOrNull() ?: 18
        val initialMinute = timeParts.getOrNull(1)?.toIntOrNull() ?: 0

        val timePickerDialog = TimePickerDialog(
            context,
            { _, hourOfDay, minute ->
                editedTime = String.format("%02d:%02d", hourOfDay, minute)
            },
            initialHour, initialMinute, false
        )

        AlertDialog(
            onDismissRequest = { editingItem = null },
            title = {
                Text(
                    text = "Edit Study Session • Day ${item.dayIndex}",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Column {
                    Text(
                        text = "${item.date} (${item.dayOfWeek})",
                        fontWeight = FontWeight.SemiBold,
                        color = RoyalBlue,
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${item.subject}: ${item.chapterTitle}",
                        fontWeight = FontWeight.Medium,
                        fontSize = 14.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Duration for this study session:",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp
                    )

                    // Duration Chips
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 6.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf(30, 45, 60, 90).forEach { mins ->
                            FilterChip(
                                selected = editedDuration == mins,
                                onClick = { editedDuration = mins },
                                label = { Text("${mins}m", fontSize = 11.sp) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Alarm Time Picker
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                            Text("Scheduled Alarm Time", fontSize = 12.sp, color = Color(0xFF64748B))
                            Text(editedTime, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = RoyalBlue)
                        }
                        Button(
                            onClick = { timePickerDialog.show() },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEFF6FF)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Change Time", color = RoyalBlue, fontSize = 12.sp, maxLines = 1, softWrap = false)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Alarm Enabled Switch
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Voice Alarm Enabled", fontSize = 13.sp, modifier = Modifier.weight(1f).padding(end = 8.dp))
                        Switch(
                            checked = alarmToggle,
                            onCheckedChange = { alarmToggle = it }
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Status Toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Mark as Completed", fontSize = 13.sp, modifier = Modifier.weight(1f).padding(end = 8.dp))
                        Checkbox(
                            checked = editedStatus == "Completed",
                            onCheckedChange = { isChecked ->
                                editedStatus = if (isChecked) "Completed" else "Pending"
                            }
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val updated = item.copy(
                            estimatedMinutes = editedDuration,
                            scheduledTime = editedTime,
                            alarmEnabled = alarmToggle,
                            status = editedStatus
                        )
                        onUpdateSchedule(updated)
                        editingItem = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                ) {
                    Text("Save Changes", color = Color.White)
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { editingItem = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}
