package online.webguruji.gurustudy.ui.screens

import android.Manifest
import android.app.AlarmManager
import android.app.TimePickerDialog
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.widget.Toast
import androidx.compose.foundation.background
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
import androidx.core.content.ContextCompat
import online.webguruji.gurustudy.alarm.AlarmScheduler
import online.webguruji.gurustudy.alarm.TTSAnnouncer
import online.webguruji.gurustudy.data.model.StudyScheduleItem
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.service.FloatingStudyReminderService
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import online.webguruji.gurustudy.ui.theme.RoyalBlueLight

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlarmCenterScreen(
    userProfile: UserProfile,
    allSchedules: List<StudyScheduleItem>,
    onBackClicked: () -> Unit,
    onLanguageChanged: (String) -> Unit
) {
    val context = LocalContext.current
    val repository = remember { StudyRepository(context) }
    val alarmScheduler = remember { AlarmScheduler(context) }

    var isFloatingEnabled by remember { mutableStateOf(repository.isFloatingReminderEnabled()) }
    var isVoiceEnabled by remember { mutableStateOf(repository.isVoiceAnnouncementEnabled()) }

    var slot0Time by remember { mutableStateOf(repository.getSlotAlarmTime(0)) }
    var slot1Time by remember { mutableStateOf(repository.getSlotAlarmTime(1)) }
    var slot2Time by remember { mutableStateOf(repository.getSlotAlarmTime(2)) }
    var slot3Time by remember { mutableStateOf(repository.getSlotAlarmTime(3)) }

    var slot0Enabled by remember { mutableStateOf(repository.isSlotAlarmEnabled(0)) }
    var slot1Enabled by remember { mutableStateOf(repository.isSlotAlarmEnabled(1)) }
    var slot2Enabled by remember { mutableStateOf(repository.isSlotAlarmEnabled(2)) }
    var slot3Enabled by remember { mutableStateOf(repository.isSlotAlarmEnabled(3)) }

    val nextAlarmInfo = remember(allSchedules, slot0Time, slot1Time, slot2Time, slot3Time) {
        alarmScheduler.getNextUpcomingAlarmTime(allSchedules) ?: "Next 4 sessions armed for tomorrow"
    }

    // Permission Diagnostics States
    val hasOverlayPermission = Settings.canDrawOverlays(context)
    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
    val canExactAlarm = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        alarmManager?.canScheduleExactAlarms() ?: true
    } else true

    val hasNotificationPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
    } else true

    val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
    val isBatteryExempt = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        powerManager?.isIgnoringBatteryOptimizations(context.packageName) ?: true
    } else true

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Smart Alarm & Reminder Center",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Native 4-slot alarms, floating overlay & notifications",
                            fontSize = 11.sp,
                            color = Color(0xFFBAE6FD)
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClicked) {
                        Text("←", fontSize = 24.sp, color = Color.White)
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {

            // 1. Next Upcoming Alarm Banner
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = RoyalBlueLight),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0x33FFFFFF),
                        modifier = Modifier.size(48.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text("⏰", fontSize = 24.sp)
                        }
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Next Armed Study Alarm",
                            color = Color(0xFFE0F2FE),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = nextAlarmInfo,
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 2. Daily 4-Hour Routine Session Slots
            Text(
                text = "Daily 4-Hour Routine Alarms",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Exact alarms for all 4 daily revision blocks (240 mins target)",
                fontSize = 12.sp,
                color = Color(0xFF64748B)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Slot 0: Mathematics (06:00)
            RoutineSlotAlarmCard(
                slotIndex = 0,
                subject = "Mathematics",
                icon = "📐",
                badgeColor = Color(0xFF2563EB),
                defaultDuration = "90 Mins • Morning Focus",
                currentTime = slot0Time,
                isEnabled = slot0Enabled,
                onToggleEnabled = { enabled ->
                    slot0Enabled = enabled
                    repository.setSlotAlarmEnabled(0, enabled)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                },
                onTimeChanged = { newTime ->
                    slot0Time = newTime
                    repository.setSlotAlarmTime(0, newTime)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                }
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Slot 1: Science (17:30)
            RoutineSlotAlarmCard(
                slotIndex = 1,
                subject = "Science",
                icon = "🔬",
                badgeColor = Color(0xFF16A34A),
                defaultDuration = "60 Mins • Evening Lab & Theory",
                currentTime = slot1Time,
                isEnabled = slot1Enabled,
                onToggleEnabled = { enabled ->
                    slot1Enabled = enabled
                    repository.setSlotAlarmEnabled(1, enabled)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                },
                onTimeChanged = { newTime ->
                    slot1Time = newTime
                    repository.setSlotAlarmTime(1, newTime)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                }
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Slot 2: Social Science (19:00)
            RoutineSlotAlarmCard(
                slotIndex = 2,
                subject = "Social Science",
                icon = "🌍",
                badgeColor = Color(0xFFD97706),
                defaultDuration = "60 Mins • History / Civics / Geo",
                currentTime = slot2Time,
                isEnabled = slot2Enabled,
                onToggleEnabled = { enabled ->
                    slot2Enabled = enabled
                    repository.setSlotAlarmEnabled(2, enabled)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                },
                onTimeChanged = { newTime ->
                    slot2Time = newTime
                    repository.setSlotAlarmTime(2, newTime)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                }
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Slot 3: English / Hindi (20:30)
            RoutineSlotAlarmCard(
                slotIndex = 3,
                subject = "English / Language",
                icon = "📖",
                badgeColor = Color(0xFF9333EA),
                defaultDuration = "30 Mins • Grammar & Literature",
                currentTime = slot3Time,
                isEnabled = slot3Enabled,
                onToggleEnabled = { enabled ->
                    slot3Enabled = enabled
                    repository.setSlotAlarmEnabled(3, enabled)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                },
                onTimeChanged = { newTime ->
                    slot3Time = newTime
                    repository.setSlotAlarmTime(3, newTime)
                    rescheduleActiveDays(repository, alarmScheduler, userProfile)
                }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // 3. Display Over Other Apps (Floating Study Reminder)
            Text(
                text = "Display Over Other Apps (Floating Overlay)",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(10.dp))

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f).padding(end = 8.dp)
                        ) {
                            Text("📱", fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column(modifier = Modifier.weight(1f, fill = false)) {
                                Text(
                                    text = "Floating Study Reminder Card",
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 14.sp
                                )
                                Text(
                                    text = if (hasOverlayPermission) "Active & Permitted" else "Requires Overlay Permission",
                                    fontSize = 12.sp,
                                    color = if (hasOverlayPermission) EmeraldGreen else Color(0xFFD97706)
                                )
                            }
                        }

                        Switch(
                            checked = isFloatingEnabled && hasOverlayPermission,
                            onCheckedChange = { checked ->
                                if (checked && !hasOverlayPermission) {
                                    val intent = Intent(
                                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                        Uri.parse("package:${context.packageName}")
                                    )
                                    context.startActivity(intent)
                                    Toast.makeText(context, "Please allow 'Display over other apps' for GuruStudy", Toast.LENGTH_LONG).show()
                                } else {
                                    isFloatingEnabled = checked
                                    repository.setFloatingReminderEnabled(checked)
                                }
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "When your scheduled revision starts, GuruStudy will display a compact, movable floating reminder over YouTube, PDF readers, and browser with Start Studying, Snooze, and Dismiss controls.",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B),
                        lineHeight = 18.sp
                    )

                    if (!hasOverlayPermission) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = {
                                val intent = Intent(
                                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                    Uri.parse("package:${context.packageName}")
                                )
                                context.startActivity(intent)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("🔓 Grant Display Over Other Apps Permission", fontSize = 13.sp, color = Color.White)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 4. Voice Announcements & Audio Customization
            Text(
                text = "Voice Announcements & Audio",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(10.dp))

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                            Text("Personalized Spoken Announcements", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text("Speaks student name, subject & chapter", fontSize = 12.sp, color = Color(0xFF64748B))
                        }
                        Switch(
                            checked = isVoiceEnabled,
                            onCheckedChange = { checked ->
                                isVoiceEnabled = checked
                                repository.setVoiceAnnouncementEnabled(checked)
                            }
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Speech Language", fontSize = 14.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f, fill = false).padding(end = 8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = userProfile.preferredLanguage == "en",
                                onClick = { onLanguageChanged("en") },
                                label = { Text("English", fontSize = 12.sp) }
                            )
                            FilterChip(
                                selected = userProfile.preferredLanguage == "hi",
                                onClick = { onLanguageChanged("hi") },
                                label = { Text("हिन्दी (Hindi)", fontSize = 12.sp) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedButton(
                        onClick = {
                            val speechText = if (userProfile.preferredLanguage == "hi") {
                                "नमस्ते ${userProfile.fullName.ifBlank { "विद्यार्थी" }}! यह गुरुस्टडी का वॉयस अलार्म टेस्ट है। परीक्षा की तैयारी शुरू करें।"
                            } else {
                                "Hello ${userProfile.fullName.ifBlank { "Student" }}! This is a test of the GuruStudy smart study announcement."
                            }
                            var announcer: TTSAnnouncer? = null
                            announcer = TTSAnnouncer(context, userProfile.preferredLanguage) {
                                announcer?.speak(speechText)
                            }
                            Toast.makeText(context, "🔊 Playing voice announcement test...", Toast.LENGTH_SHORT).show()
                        },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("🔊 Test Spoken Voice Announcement Now", fontSize = 13.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 5. Instant Live Testing Hub
            Text(
                text = "Live Testing & Diagnostics Hub",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )
            Text(
                text = "Verify notifications, full-screen alarm & floating reminder instantly",
                fontSize = 12.sp,
                color = Color(0xFF64748B)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Test Button 1: Notification
                    Button(
                        onClick = {
                            alarmScheduler.scheduleTestAlarm(
                                studentName = userProfile.fullName.ifBlank { "Student" },
                                subject = "Mathematics",
                                chapter = "Real Numbers & Polynomials",
                                duration = 90,
                                delaySeconds = 1
                            )
                            Toast.makeText(context, "🔔 Test notification sent!", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("🔔 Trigger Actionable Study Notification (1 sec)", fontSize = 13.sp, color = Color.White)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Test Button 2: Full Screen Alarm (5s Delay)
                    Button(
                        onClick = {
                            alarmScheduler.scheduleTestAlarm(
                                studentName = userProfile.fullName.ifBlank { "Student" },
                                subject = "Science",
                                chapter = "Chemical Reactions & Equations",
                                duration = 60,
                                delaySeconds = 5
                            )
                            Toast.makeText(
                                context,
                                "⏰ Full-screen alarm scheduled! Lock screen or exit app to test in 5 seconds...",
                                Toast.LENGTH_LONG
                            ).show()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("⏰ Trigger Full-Screen Alarm (5s Delay)", fontSize = 13.sp, color = Color.White)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Test Button 3: Floating Reminder Overlay
                    OutlinedButton(
                        onClick = {
                            if (!Settings.canDrawOverlays(context)) {
                                val intent = Intent(
                                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                    Uri.parse("package:${context.packageName}")
                                )
                                context.startActivity(intent)
                                Toast.makeText(context, "Grant overlay permission first", Toast.LENGTH_SHORT).show()
                            } else {
                                Toast.makeText(context, "📱 Launching floating reminder in 2 seconds...", Toast.LENGTH_SHORT).show()
                                Handler(Looper.getMainLooper()).postDelayed({
                                    val reminderIntent = Intent(context, FloatingStudyReminderService::class.java).apply {
                                        action = FloatingStudyReminderService.ACTION_SHOW_REMINDER
                                        putExtra(FloatingStudyReminderService.EXTRA_STUDENT_NAME, userProfile.fullName.ifBlank { "Student" })
                                        putExtra(FloatingStudyReminderService.EXTRA_SUBJECT, "Social Science")
                                        putExtra(FloatingStudyReminderService.EXTRA_CHAPTER, "The Rise of Nationalism in Europe")
                                        putExtra(FloatingStudyReminderService.EXTRA_DURATION, 60)
                                        putExtra(FloatingStudyReminderService.EXTRA_DAY_INDEX, 1)
                                        putExtra(FloatingStudyReminderService.EXTRA_SLOT_INDEX, 2)
                                    }
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                        context.startForegroundService(reminderIntent)
                                    } else {
                                        context.startService(reminderIntent)
                                    }
                                }, 2000L)
                            }
                        },
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("📱 Test Floating Reminder Overlay Card (2s)", fontSize = 13.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // 6. System Permission & Battery Diagnostics Section
            Text(
                text = "Android System Health & Battery Status",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Notifications Status
            PermissionDiagnosticRow(
                title = "Study Notifications (POST_NOTIFICATIONS)",
                subtitle = if (hasNotificationPermission) "Allowed by system" else "Blocked in Android settings",
                isGranted = hasNotificationPermission,
                onFixClick = {
                    val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                        putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
                    }
                    context.startActivity(intent)
                }
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Exact Alarms Status
            PermissionDiagnosticRow(
                title = "Exact Alarms (SCHEDULE_EXACT_ALARM)",
                subtitle = if (canExactAlarm) "Precise minute timing permitted" else "Inexact fallback mode",
                isGranted = canExactAlarm,
                onFixClick = {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                            data = Uri.parse("package:${context.packageName}")
                        }
                        context.startActivity(intent)
                    }
                }
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Display Over Other Apps Status
            PermissionDiagnosticRow(
                title = "Display Over Other Apps (SYSTEM_ALERT_WINDOW)",
                subtitle = if (hasOverlayPermission) "Granted for floating cards" else "Required for floating reminder",
                isGranted = hasOverlayPermission,
                onFixClick = {
                    val intent = Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:${context.packageName}")
                    )
                    context.startActivity(intent)
                }
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Battery Optimization Exemption
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                            Text(
                                text = "Battery Optimization Exemption",
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 13.sp
                            )
                            Text(
                                text = if (isBatteryExempt) "✓ Exempt (Unrestricted delivery)" else "⚠️ Optimized (May be restricted by OEM)",
                                fontSize = 11.sp,
                                color = if (isBatteryExempt) EmeraldGreen else Color(0xFFD97706)
                            )
                        }
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isBatteryExempt) Color(0xFFDCFCE7) else Color(0xFFFEF3C7)
                        ) {
                            Text(
                                text = if (isBatteryExempt) "Optimal" else "Check",
                                color = if (isBatteryExempt) Color(0xFF16A34A) else Color(0xFFD97706),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                maxLines = 1,
                                softWrap = false
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Aggressive background task killers on Xiaomi (HyperOS/MIUI), Samsung (One UI), and Oppo/Realme may silence alarms if battery optimization is enabled.",
                        fontSize = 11.sp,
                        color = Color(0xFF64748B),
                        lineHeight = 16.sp
                    )

                    if (!isBatteryExempt) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Button(
                            onClick = {
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                    try {
                                        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                                            data = Uri.parse("package:${context.packageName}")
                                        }
                                        context.startActivity(intent)
                                    } catch (e: Exception) {
                                        val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
                                        context.startActivity(intent)
                                    }
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF475569)),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("⚡ Request Unrestricted Battery", fontSize = 12.sp, color = Color.White)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
fun RoutineSlotAlarmCard(
    slotIndex: Int,
    subject: String,
    icon: String,
    badgeColor: Color,
    defaultDuration: String,
    currentTime: String,
    isEnabled: Boolean,
    onToggleEnabled: (Boolean) -> Unit,
    onTimeChanged: (String) -> Unit
) {
    val context = LocalContext.current

    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = CircleShape,
                color = badgeColor.copy(alpha = 0.15f),
                modifier = Modifier.size(42.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(icon, fontSize = 20.sp)
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = subject,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "• Slot ${slotIndex + 1}",
                        fontSize = 11.sp,
                        color = Color(0xFF94A3B8)
                    )
                }

                Text(
                    text = defaultDuration,
                    fontSize = 11.sp,
                    color = Color(0xFF64748B)
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "⏰ $currentTime",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isEnabled) RoyalBlue else Color(0xFF94A3B8)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    TextButton(
                        onClick = {
                            val timeParts = currentTime.split(":")
                            val initialHour = timeParts.getOrNull(0)?.toIntOrNull() ?: 6
                            val initialMinute = timeParts.getOrNull(1)?.toIntOrNull() ?: 0

                            TimePickerDialog(
                                context,
                                { _, hourOfDay, minute ->
                                    val formattedTime = String.format("%02d:%02d", hourOfDay, minute)
                                    onTimeChanged(formattedTime)
                                },
                                initialHour,
                                initialMinute,
                                true
                            ).show()
                        },
                        contentPadding = PaddingValues(horizontal = 6.dp, vertical = 0.dp),
                        modifier = Modifier.height(28.dp)
                    ) {
                        Text("Edit Time", fontSize = 11.sp, color = RoyalBlue)
                    }
                }
            }

            Switch(
                checked = isEnabled,
                onCheckedChange = onToggleEnabled
            )
        }
    }
}

@Composable
fun PermissionDiagnosticRow(
    title: String,
    subtitle: String,
    isGranted: Boolean,
    onFixClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f).padding(end = 8.dp)) {
                Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = if (isGranted) EmeraldGreen else Color(0xFFD97706)
                )
            }

            if (isGranted) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFDCFCE7)
                ) {
                    Text(
                        text = "✓ OK",
                        color = Color(0xFF16A34A),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        maxLines = 1,
                        softWrap = false
                    )
                }
            } else {
                Button(
                    onClick = onFixClick,
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier.height(32.dp)
                ) {
                    Text("Grant", fontSize = 11.sp, color = Color.White, maxLines = 1, softWrap = false)
                }
            }
        }
    }
}

private fun rescheduleActiveDays(
    repository: StudyRepository,
    scheduler: AlarmScheduler,
    profile: UserProfile
) {
    val schedules = repository.getAllSchedules()
    schedules.take(7).forEach { item ->
        if (item.alarmEnabled && item.status != "Completed") {
            scheduler.scheduleStudyAlarm(item, profile.fullName.ifBlank { "Student" })
        }
    }
}
