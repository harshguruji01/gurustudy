package online.webguruji.gurustudy.ui.screens

import android.Manifest
import android.app.AlarmManager
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.widget.Toast
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import java.io.File

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    userProfile: UserProfile,
    isDarkMode: Boolean,
    onToggleDarkMode: (Boolean) -> Unit,
    onLanguageChanged: (String) -> Unit,
    onSaveProfile: (UserProfile) -> Unit,
    onResetData: () -> Unit,
    onNavigateToAlarmCenter: () -> Unit = {},
    onDataRestored: () -> Unit = {}
) {
    val context = LocalContext.current
    val repo = remember { StudyRepository(context) }

    // Dialog states
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showResetDialog by remember { mutableStateOf(false) }
    var showExportDialog by remember { mutableStateOf(false) }
    var exportJsonString by remember { mutableStateOf("") }
    var showRestoreDialog by remember { mutableStateOf(false) }
    var restoreJsonInput by remember { mutableStateOf("") }
    var restoreError by remember { mutableStateOf<String?>(null) }
    var showPrivacyPolicyDialog by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var showSupportDialog by remember { mutableStateOf(false) }

    // Settings category filter tab (0: All, 1: Appearance, 2: Study, 3: Alarms, 4: Reading, 5: Storage)
    var selectedCategoryTab by remember { mutableIntStateOf(0) }

    // Live preferences state
    var themeMode by remember { mutableStateOf(repo.getThemeMode()) }
    var accentColor by remember { mutableStateOf(repo.getAccentColor()) }
    var fontSizeScale by remember { mutableStateOf(repo.getFontSizeScale()) }
    var reducedMotion by remember { mutableStateOf(repo.isReducedMotion()) }
    var compactDensity by remember { mutableStateOf(repo.isCompactDensity()) }
    var breakDuration by remember { mutableIntStateOf(repo.getBreakDuration()) }
    var timerSound by remember { mutableStateOf(repo.isTimerSoundEnabled()) }
    var timerVibrate by remember { mutableStateOf(repo.isTimerVibrateEnabled()) }
    var readerThemePref by remember { mutableStateOf(repo.getReaderTheme()) }
    var readerLineSpacing by remember { mutableFloatStateOf(repo.getReaderLineSpacing()) }

    // Calculate approximate local storage
    val dbFile = context.getDatabasePath("gurustudy_database.db")
    val dbSizeKb = if (dbFile.exists()) dbFile.length() / 1024 else 120
    val cacheSizeKb = try {
        val cacheDir = context.cacheDir
        (cacheDir.walkTopDown().filter { it.isFile }.map { it.length() }.sum()) / 1024
    } catch (e: Exception) { 45L }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Settings & Student Control Center",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = Color.White
                        )
                        Text(
                            text = "GuruStudy v2.1.0 • CBSE Class 10 (2026–27)",
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
            // Category Selector Tabs
            ScrollableTabRow(
                selectedTabIndex = selectedCategoryTab,
                containerColor = MaterialTheme.colorScheme.surface,
                edgePadding = 12.dp
            ) {
                listOf("All Settings", "🎨 Appearance", "🎯 Study Target", "🔔 Alarms", "📖 Reading", "💾 Backup & Storage", "ℹ️ About").forEachIndexed { idx, title ->
                    Tab(
                        selected = selectedCategoryTab == idx,
                        onClick = { selectedCategoryTab = idx },
                        text = { Text(title, fontSize = 12.sp) }
                    )
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                // Profile Header Card (Shown on All or when tab 0)
                if (selectedCategoryTab == 0 || selectedCategoryTab == 1) {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = CircleShape,
                                    color = Color(0xFFDBEAFE),
                                    modifier = Modifier.size(56.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text(
                                            text = userProfile.fullName.take(1).uppercase().ifBlank { "S" },
                                            fontSize = 24.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = RoyalBlue
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(14.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = userProfile.fullName.ifBlank { "Student" },
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${userProfile.className} • Section ${userProfile.section}",
                                        fontSize = 13.sp,
                                        color = Color(0xFF64748B)
                                    )
                                    Text(
                                        text = userProfile.schoolName.ifBlank { "School Name Not Specified" },
                                        fontSize = 12.sp,
                                        color = Color(0xFF94A3B8)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color(0xFFEFF6FF)
                                ) {
                                    Text(
                                        text = "Hindi: ${userProfile.hindiCourse}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = RoyalBlue,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color(0xFFDCFCE7)
                                ) {
                                    Text(
                                        text = "Daily Goal: ${userProfile.dailyStudyGoalMinutes}m (4h)",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color(0xFF16A34A),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color(0xFFFEF3C7)
                                ) {
                                    Text(
                                        text = "🔥 ${userProfile.studyStreak}d Streak",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color(0xFFD97706),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Button(
                                onClick = { showEditProfileDialog = true },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                                modifier = Modifier.fillMaxWidth().height(44.dp)
                            ) {
                                Text("✏️ Edit Student Profile Details", fontSize = 13.sp, color = Color.White)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                }

                // ================= SECTION 1: APPEARANCE =================
                if (selectedCategoryTab == 0 || selectedCategoryTab == 1) {
                    Text("🎨 Appearance & Display", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Dark Theme Switch
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Dark Theme", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("Easier on eyes during late-night revision", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                Switch(
                                    checked = isDarkMode,
                                    onCheckedChange = {
                                        onToggleDarkMode(it)
                                        repo.setDarkMode(it)
                                    }
                                )
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            // Accent Color
                            Text("Theme Accent Color", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf(
                                    Pair("royal_blue", "Royal Blue"),
                                    Pair("emerald", "Emerald"),
                                    Pair("purple", "Purple"),
                                    Pair("crimson", "Crimson")
                                ).forEach { (id, label) ->
                                    FilterChip(
                                        selected = accentColor == id,
                                        onClick = {
                                            accentColor = id
                                            repo.setAccentColor(id)
                                            Toast.makeText(context, "Accent set to $label", Toast.LENGTH_SHORT).show()
                                        },
                                        label = { Text(label, fontSize = 11.sp) }
                                    )
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            // Language Switch
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("App Language / भाषा", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text(if (userProfile.preferredLanguage == "hi") "हिन्दी (Hindi)" else "English", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    FilterChip(
                                        selected = userProfile.preferredLanguage == "en",
                                        onClick = { onLanguageChanged("en") },
                                        label = { Text("EN", fontSize = 11.sp) }
                                    )
                                    FilterChip(
                                        selected = userProfile.preferredLanguage == "hi",
                                        onClick = { onLanguageChanged("hi") },
                                        label = { Text("हिं", fontSize = 11.sp) }
                                    )
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            // Reduced Motion
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Reduced Motion", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("Disables non-essential transition animations", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                Switch(
                                    checked = reducedMotion,
                                    onCheckedChange = {
                                        reducedMotion = it
                                        repo.setReducedMotion(it)
                                    }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                }

                // ================= SECTION 2: STUDY & TIMER PREFERENCES =================
                if (selectedCategoryTab == 0 || selectedCategoryTab == 2) {
                    Text("🎯 Study Goals & Timer Settings", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Daily Revision Target (Minutes)", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text("Recommended: 240 mins (4 hours divided into 4 slots)", fontSize = 12.sp, color = Color(0xFF64748B))
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf(120, 180, 240, 300).forEach { mins ->
                                    FilterChip(
                                        selected = userProfile.dailyStudyGoalMinutes == mins,
                                        onClick = {
                                            val updated = userProfile.copy(dailyStudyGoalMinutes = mins)
                                            repo.saveUserProfile(updated)
                                            onSaveProfile(updated)
                                        },
                                        label = { Text("${mins / 60} Hours", fontSize = 11.sp) }
                                    )
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Text("Break Duration", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text("Short break interval between focus sessions", fontSize = 12.sp, color = Color(0xFF64748B))
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf(5, 10, 15).forEach { mins ->
                                    FilterChip(
                                        selected = breakDuration == mins,
                                        onClick = {
                                            breakDuration = mins
                                            repo.setBreakDuration(mins)
                                        },
                                        label = { Text("${mins}m Break", fontSize = 11.sp) }
                                    )
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Timer Completion Chime", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("Play audible chime when session ends", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                Switch(
                                    checked = timerSound,
                                    onCheckedChange = {
                                        timerSound = it
                                        repo.setTimerSoundEnabled(it)
                                    }
                                )
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Timer Vibration Alert", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("Vibrate phone on focus session finish", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                Switch(
                                    checked = timerVibrate,
                                    onCheckedChange = {
                                        timerVibrate = it
                                        repo.setTimerVibrateEnabled(it)
                                    }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                }

                // ================= SECTION 3: NOTIFICATIONS & ALARMS =================
                if (selectedCategoryTab == 0 || selectedCategoryTab == 3) {
                    Text("🔔 Alarms & Reminders Hub", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = RoyalBlue),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = Color(0x33FFFFFF),
                                modifier = Modifier.size(46.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text("⏰", fontSize = 22.sp)
                                }
                            }
                            Spacer(modifier = Modifier.width(14.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Smart Alarm & Overlay Center",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = Color.White
                                )
                                Text(
                                    text = "Configure 4 routine alarms, floating reminders & voice alerts",
                                    fontSize = 11.sp,
                                    color = Color(0xFFBAE6FD)
                                )
                            }
                            Button(
                                onClick = onNavigateToAlarmCenter,
                                colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("Open", color = RoyalBlue, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    val hasOverlayPermission = Settings.canDrawOverlays(context)
                    val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager
                    val canExactAlarm = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        alarmManager?.canScheduleExactAlarms() ?: true
                    } else true
                    val hasNotificationPermission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
                    } else true

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("System Permission Diagnostics", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(8.dp))

                            PermissionStatusRow("Post Notifications", hasNotificationPermission) {
                                val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                                    putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
                                }
                                context.startActivity(intent)
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))

                            PermissionStatusRow("Exact Clock Alarms", canExactAlarm) {
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                                    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM).apply {
                                        data = Uri.parse("package:${context.packageName}")
                                    }
                                    context.startActivity(intent)
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp))

                            PermissionStatusRow("Display Over Other Apps", hasOverlayPermission) {
                                val intent = Intent(
                                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                    Uri.parse("package:${context.packageName}")
                                )
                                context.startActivity(intent)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                }

                // ================= SECTION 4: BOOKS & READING PREFERENCES =================
                if (selectedCategoryTab == 0 || selectedCategoryTab == 4) {
                    Text("📖 Books & Reader Preferences", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Default Reader Theme", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf(
                                    Pair("light", "☀️ Normal Light"),
                                    Pair("sepia", "📜 Warm Sepia"),
                                    Pair("dark", "🌙 Dark Night")
                                ).forEach { (id, label) ->
                                    FilterChip(
                                        selected = readerThemePref == id,
                                        onClick = {
                                            readerThemePref = id
                                            repo.setReaderTheme(id)
                                        },
                                        label = { Text(label, fontSize = 11.sp) }
                                    )
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Text("Line Spacing Mode", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                FilterChip(
                                    selected = readerLineSpacing == 1.5f,
                                    onClick = {
                                        readerLineSpacing = 1.5f
                                        repo.setReaderLineSpacing(1.5f)
                                    },
                                    label = { Text("Standard (1.5x)", fontSize = 11.sp) }
                                )
                                FilterChip(
                                    selected = readerLineSpacing == 1.8f,
                                    onClick = {
                                        readerLineSpacing = 1.8f
                                        repo.setReaderLineSpacing(1.8f)
                                    },
                                    label = { Text("Comfortable (1.8x)", fontSize = 11.sp) }
                                )
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("NCERT Offline Content", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("Class 10 CBSE 2026–27 verified syllabus", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = Color(0xFFDCFCE7)
                                ) {
                                    Text("✓ 100% Offline", color = Color(0xFF16A34A), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                }

                // ================= SECTION 5: BACKUP, STORAGE & MAINTENANCE =================
                if (selectedCategoryTab == 0 || selectedCategoryTab == 5) {
                    Text("💾 Data Portability, Storage & Backup", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Local Storage Usage", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                    Text("Database: ~${dbSizeKb} KB • Cache: ~${cacheSizeKb} KB", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                                OutlinedButton(
                                    onClick = {
                                        try {
                                            context.cacheDir.deleteRecursively()
                                            Toast.makeText(context, "App cache cleared cleanly!", Toast.LENGTH_SHORT).show()
                                        } catch (e: Exception) {
                                            e.printStackTrace()
                                        }
                                    },
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text("Clear Cache", fontSize = 11.sp)
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Text(
                                text = "Export your entire revision plan progress, completed chapters, focus sessions, and mistake notebook to a secure JSON file.",
                                fontSize = 12.sp,
                                color = Color(0xFF64748B),
                                lineHeight = 18.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Button(
                                    onClick = {
                                        exportJsonString = repo.exportBackupJson()
                                        showExportDialog = true
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.weight(1f).height(46.dp)
                                ) {
                                    Text("📥 Export Backup", fontSize = 12.sp, color = Color.White)
                                }

                                OutlinedButton(
                                    onClick = {
                                        restoreJsonInput = ""
                                        restoreError = null
                                        showRestoreDialog = true
                                    },
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier.weight(1f).height(46.dp)
                                ) {
                                    Text("📤 Restore Backup", fontSize = 12.sp)
                                }
                            }

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp))

                            Button(
                                onClick = { showResetDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth().height(44.dp)
                            ) {
                                Text("⚠️ Reset All Data on this Device", color = Color.White, fontSize = 13.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))
                }

                // ================= SECTION 6: ABOUT GURUSTUDY =================
                if (selectedCategoryTab == 0 || selectedCategoryTab == 6) {
                    Text("ℹ️ About GuruStudy", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(8.dp))

                    Card(
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = RoyalBlue,
                                    modifier = Modifier.size(44.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Text("GS", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    }
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text("GuruStudy • CBSE Class 10", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                    Text("Version 2.1.0 • Academic Session 2026–2027", fontSize = 12.sp, color = Color(0xFF64748B))
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Text(
                                text = "Developer: HarshGuruJi\nOfficial Website: https://gurustudy.webguruji.online\nDedicated to excellence in CBSE Class 10 board exam preparation.",
                                fontSize = 12.sp,
                                color = Color(0xFF475569),
                                lineHeight = 18.sp
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedButton(
                                    onClick = { showPrivacyPolicyDialog = true },
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Privacy Policy", fontSize = 11.sp)
                                }
                                OutlinedButton(
                                    onClick = { showTermsDialog = true },
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Terms of Use", fontSize = 11.sp)
                                }
                                OutlinedButton(
                                    onClick = { showSupportDialog = true },
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text("Support", fontSize = 11.sp)
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(30.dp))
                }
            }
        }
    }

    // Edit Profile Dialog
    if (showEditProfileDialog) {
        var nameInput by remember { mutableStateOf(userProfile.fullName) }
        var dobInput by remember { mutableStateOf(userProfile.dateOfBirth) }
        var sectionInput by remember { mutableStateOf(userProfile.section) }
        var schoolInput by remember { mutableStateOf(userProfile.schoolName) }
        var hindiCourseInput by remember { mutableStateOf(userProfile.hindiCourse) }

        AlertDialog(
            onDismissRequest = { showEditProfileDialog = false },
            title = { Text("Edit Student Profile", fontWeight = FontWeight.Bold) },
            text = {
                Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                    OutlinedTextField(
                        value = nameInput,
                        onValueChange = { nameInput = it },
                        label = { Text("Student Full Name") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = schoolInput,
                        onValueChange = { schoolInput = it },
                        label = { Text("School Name") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = sectionInput,
                        onValueChange = { sectionInput = it },
                        label = { Text("Section") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("Hindi Course Selection:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = hindiCourseInput == "Course A",
                            onClick = { hindiCourseInput = "Course A" },
                            label = { Text("Course A (Kshitij)") }
                        )
                        FilterChip(
                            selected = hindiCourseInput == "Course B",
                            onClick = { hindiCourseInput = "Course B" },
                            label = { Text("Course B (Sparsh)") }
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val updated = userProfile.copy(
                            fullName = nameInput.trim(),
                            schoolName = schoolInput.trim(),
                            section = sectionInput.trim(),
                            hindiCourse = hindiCourseInput
                        )
                        repo.saveUserProfile(updated)
                        onSaveProfile(updated)
                        showEditProfileDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                ) {
                    Text("Save Changes", color = Color.White)
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showEditProfileDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Reset Data Dialog
    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("Delete All Data?", fontWeight = FontWeight.Bold) },
            text = { Text("This will permanently clear your profile, completed chapters, focus sessions, and mistake notebook from this device.") },
            confirmButton = {
                Button(
                    onClick = {
                        showResetDialog = false
                        onResetData()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                ) {
                    Text("Delete Everything", color = Color.White)
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showResetDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Export Backup Dialog
    if (showExportDialog) {
        val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as? ClipboardManager
        AlertDialog(
            onDismissRequest = { showExportDialog = false },
            title = { Text("📥 Offline Backup Exported", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("Your backup JSON payload has been generated. You can copy it or save it securely for data portability across devices.", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedTextField(
                        value = exportJsonString.take(400) + if (exportJsonString.length > 400) "... [${exportJsonString.length} chars total]" else "",
                        onValueChange = {},
                        readOnly = true,
                        modifier = Modifier.fillMaxWidth().height(120.dp)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val clip = ClipData.newPlainText("GuruStudy_Backup", exportJsonString)
                        clipboardManager?.setPrimaryClip(clip)
                        Toast.makeText(context, "Backup copied to clipboard!", Toast.LENGTH_SHORT).show()
                        showExportDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                ) {
                    Text("📋 Copy to Clipboard", color = Color.White)
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showExportDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // Restore Backup Dialog
    if (showRestoreDialog) {
        AlertDialog(
            onDismissRequest = { showRestoreDialog = false },
            title = { Text("📤 Restore Backup Data", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("Paste your exported GuruStudy JSON backup payload below:", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = restoreJsonInput,
                        onValueChange = {
                            restoreJsonInput = it
                            restoreError = null
                        },
                        placeholder = { Text("Paste JSON payload here...") },
                        modifier = Modifier.fillMaxWidth().height(140.dp)
                    )
                    if (restoreError != null) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(text = "❌ $restoreError", color = Color(0xFFEF4444), fontSize = 12.sp)
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (restoreJsonInput.isBlank()) {
                            restoreError = "Please paste a valid JSON backup string."
                        } else {
                            val success = repo.importBackupJson(restoreJsonInput.trim())
                            if (success) {
                                Toast.makeText(context, "Backup restored successfully!", Toast.LENGTH_LONG).show()
                                showRestoreDialog = false
                                onDataRestored()
                            } else {
                                restoreError = "Invalid backup format or corrupted JSON file."
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen)
                ) {
                    Text("Restore Now", color = Color.White)
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showRestoreDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Privacy Policy Dialog
    if (showPrivacyPolicyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyPolicyDialog = false },
            title = { Text("GuruStudy Privacy Policy", fontWeight = FontWeight.Bold) },
            text = {
                Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                    Text(
                        text = "GuruStudy is an offline-first educational application designed for CBSE Class 10 students.\n\n" +
                                "1. Local Data Storage: All study progress, notes, mistakes, and schedules remain stored locally in your device's private SQLite database and encrypted SharedPreferences.\n\n" +
                                "2. No Data Selling: We do not collect, sell, or transmit student personal records.\n\n" +
                                "3. AI Privacy: If you use the optional Gemini AI feature, queries are transmitted securely to Google's Generative AI endpoint using your own private key.\n\n" +
                                "Author & Maintainer: HarshGuruJi (contact@webguruji.online)",
                        fontSize = 13.sp,
                        lineHeight = 19.sp
                    )
                }
            },
            confirmButton = {
                Button(onClick = { showPrivacyPolicyDialog = false }) { Text("Close") }
            }
        )
    }

    // Terms of Use Dialog
    if (showTermsDialog) {
        AlertDialog(
            onDismissRequest = { showTermsDialog = false },
            title = { Text("Terms of Use", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    text = "GuruStudy is provided as a free revision companion for CBSE Class 10 board examinees (Academic Session 2026–2027).\n\n" +
                            "Textbook contents and syllabi are aligned with official NCERT and CBSE publications. All rights reserved by HarshGuruJi.",
                    fontSize = 13.sp,
                    lineHeight = 19.sp
                )
            },
            confirmButton = {
                Button(onClick = { showTermsDialog = false }) { Text("Understood") }
            }
        )
    }

    // Support Dialog
    if (showSupportDialog) {
        AlertDialog(
            onDismissRequest = { showSupportDialog = false },
            title = { Text("GuruStudy Support & Feedback", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("Developer: HarshGuruJi", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                    Text("Website: https://gurustudy.webguruji.online", fontSize = 13.sp, color = RoyalBlue)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("For feedback, curriculum inquiries, or feature suggestions, visit our website or reach out via official portal channels.", fontSize = 13.sp, lineHeight = 18.sp)
                }
            },
            confirmButton = {
                Button(onClick = { showSupportDialog = false }) { Text("Close") }
            }
        )
    }
}

@Composable
fun PermissionStatusRow(
    title: String,
    isGranted: Boolean,
    onActionClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
            Text(
                text = if (isGranted) "✓ Granted & Active" else "⚠️ Permission Required",
                fontSize = 11.sp,
                color = if (isGranted) Color(0xFF16A34A) else Color(0xFFD97706)
            )
        }
        if (!isGranted) {
            Button(
                onClick = onActionClick,
                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                shape = RoundedCornerShape(8.dp),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                modifier = Modifier.height(32.dp)
            ) {
                Text("Enable", fontSize = 11.sp, color = Color.White)
            }
        } else {
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = Color(0xFFDCFCE7)
            ) {
                Text("Active", fontSize = 11.sp, color = Color(0xFF16A34A), fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
            }
        }
    }
}
