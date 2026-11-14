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
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalendarScreen(
    schedules: List<StudyScheduleItem>,
    onUpdateSchedule: (StudyScheduleItem) -> Unit,
    onStartStudy: (StudyScheduleItem) -> Unit
) {
    val context = LocalContext.current
    var selectedMonthFilter by remember { mutableStateOf("All") } // "All", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027"
    var editingItem by remember { mutableStateOf<StudyScheduleItem?>(null) }

    // Filter schedules
    val filteredSchedules = when (selectedMonthFilter) {
        "Nov 2026" -> schedules.filter { it.date.startsWith("2026-11") }
        "Dec 2026" -> schedules.filter { it.date.startsWith("2026-12") }
        "Jan 2027" -> schedules.filter { it.date.startsWith("2027-01") }
        "Feb 2027" -> schedules.filter { it.date.startsWith("2027-02") }
        else -> schedules
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "My Study Calendar 2026–27",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "93-Day Preparation (15 Nov 2026 – 15 Feb 2027)",
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
            // Month Filter Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val months = listOf("All (93 Days)", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027")
                items(months) { month ->
                    val isSelected = (month.startsWith("All") && selectedMonthFilter == "All") || month == selectedMonthFilter
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            selectedMonthFilter = if (month.startsWith("All")) "All" else month
                        },
                        label = { Text(month, fontSize = 12.sp) }
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
                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
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
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                    Text(
                                        text = "Day ${item.dayIndex}",
                                        fontSize = 11.sp,
                                        color = Color(0xFF94A3B8)
                                    )
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Text(
                                    text = item.chapterTitle,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurface
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
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
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
                        text = "Aaj is chapter ko kitne time mein padhna chahte hain?",
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
                        Column {
                            Text("Scheduled Alarm Time", fontSize = 12.sp, color = Color(0xFF64748B))
                            Text(editedTime, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = RoyalBlue)
                        }
                        Button(
                            onClick = { timePickerDialog.show() },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEFF6FF)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Change Time", color = RoyalBlue, fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Alarm Enabled Switch
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Voice Alarm Enabled", fontSize = 13.sp)
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
                        Text("Mark as Completed", fontSize = 13.sp)
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
