package online.webguruji.gurustudy.ui.dialogs

import android.app.TimePickerDialog
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import java.util.Calendar

@Composable
fun DailyAlarmSetupDialog(
    todaySchedule: StudyScheduleItem?,
    userProfile: UserProfile,
    defaultStartTime: String = "17:00",
    onSetAlarms: (startHour: Int, startMinute: Int) -> Unit,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current

    // Parse initial hour and minute
    val timeParts = defaultStartTime.split(":")
    var selectedHour by remember { mutableIntStateOf(timeParts.getOrNull(0)?.toIntOrNull() ?: 17) }
    var selectedMinute by remember { mutableIntStateOf(timeParts.getOrNull(1)?.toIntOrNull() ?: 0) }

    val formattedTime = remember(selectedHour, selectedMinute) {
        val amPm = if (selectedHour >= 12) "PM" else "AM"
        val displayHour = if (selectedHour % 12 == 0) 12 else selectedHour % 12
        String.format("%02d:%02d %s", displayHour, selectedMinute, amPm)
    }

    val timePickerDialog = remember {
        TimePickerDialog(
            context,
            { _, h, m ->
                selectedHour = h
                selectedMinute = m
            },
            selectedHour,
            selectedMinute,
            false
        )
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(
            dismissOnBackPress = true,
            dismissOnClickOutside = false,
            usePlatformDefaultWidth = false
        )
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .padding(vertical = 20.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(22.dp)
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header Icon
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFFEF3C7),
                    modifier = Modifier.size(64.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = "⏰", fontSize = 32.sp)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = if (userProfile.preferredLanguage == "hi") "आज की पढ़ाई का टाइम सेट करें!" else "Schedule Today's Study Alarms!",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "Day ${todaySchedule?.dayIndex ?: 1} • Consecutive Multi-Subject Alarms",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = RoyalBlue
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = if (userProfile.preferredLanguage == "hi")
                        "एक स्टार्ट टाइम चुनें। जैसे ही एक विषय खत्म होगा, अगले विषय का अलार्म अपने आप 'Time ho gaya, go to study!' बोलकर बजेगा!"
                    else
                        "Select your study start time. As each subject ends, the next alarm will automatically announce 'Time ho gaya, go to study!'",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Time Selection Box
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { timePickerDialog.show() }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "Daily Start Time",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = formattedTime,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = RoyalBlue
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = RoyalBlue.copy(alpha = 0.12f),
                            modifier = Modifier.padding(4.dp)
                        ) {
                            Text(
                                text = "✏️ Change",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = RoyalBlue,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Quick Presets
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        Pair(17, 0) to "5:00 PM",
                        Pair(18, 0) to "6:00 PM",
                        Pair(19, 0) to "7:00 PM"
                    ).forEach { (time, label) ->
                        val isSelected = selectedHour == time.first && selectedMinute == time.second
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isSelected) RoyalBlue else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    selectedHour = time.first
                                    selectedMinute = time.second
                                }
                        ) {
                            Text(
                                text = label,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Preview of Today's Chained Schedule
                Text(
                    text = "Today's Sequential Study Flow",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                val slots = todaySchedule?.slots?.ifEmpty { null } ?: listOf(
                    online.webguruji.gurustudy.data.model.StudySlotItem(
                        subject = todaySchedule?.subject ?: "Class 10 Subject",
                        topic = todaySchedule?.chapterTitle ?: "Chapter Revision",
                        durationMinutes = todaySchedule?.estimatedMinutes ?: 60
                    )
                )

                var runningHour = selectedHour
                var runningMinute = selectedMinute

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    slots.forEachIndexed { idx, slot ->
                        val slotStartHour = runningHour
                        val slotStartMin = runningMinute
                        val amPm = if (slotStartHour >= 12) "PM" else "AM"
                        val dispHour = if (slotStartHour % 12 == 0) 12 else slotStartHour % 12
                        val slotTimeStr = String.format("%02d:%02d %s", dispHour, slotStartMin, amPm)

                        val duration = if (slot.durationMinutes > 0) slot.durationMinutes else 45
                        val nextTotalMin = runningHour * 60 + runningMinute + duration + 5
                        runningHour = (nextTotalMin / 60) % 24
                        runningMinute = nextTotalMin % 60

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(
                                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.35f),
                                    shape = RoundedCornerShape(10.dp)
                                )
                                .padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Surface(
                                    shape = CircleShape,
                                    color = when (idx) {
                                        0 -> Color(0xFF2563EB)
                                        1 -> Color(0xFF059669)
                                        2 -> Color(0xFFD97706)
                                        else -> Color(0xFF7C3AED)
                                    },
                                    modifier = Modifier.size(20.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            text = "${idx + 1}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(8.dp))

                                Column {
                                    Text(
                                        text = slot.subject,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = "${slot.topic.take(24)} (${duration}m)",
                                        fontSize = 10.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Text(
                                text = "🔔 $slotTimeStr",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = RoyalBlue
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(22.dp))

                // CTA Button: Set All Alarms
                Button(
                    onClick = {
                        onSetAlarms(selectedHour, selectedMinute)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = RoyalBlue
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Text(
                        text = "🔔 Set All Alarms For Today",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                TextButton(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Remind Me Later",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
