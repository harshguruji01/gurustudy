package online.webguruji.gurustudy.ui.screens

import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.media.ToneGenerator
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.provider.Settings
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import online.webguruji.gurustudy.data.model.FocusSessionItem
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.service.FloatingTimerService
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import online.webguruji.gurustudy.ui.theme.RoyalBlueLight
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudyTimerScreen(
    subjectName: String,
    chapterTitle: String,
    initialMinutes: Int = 45,
    onBackClicked: () -> Unit,
    onSessionCompleted: () -> Unit
) {
    val context = LocalContext.current
    val repository = remember { StudyRepository(context) }

    var sessionMode by remember { mutableStateOf("Study") } // "Study", "Short Break", "Long Break"
    var totalSeconds by remember { mutableIntStateOf(initialMinutes * 60) }
    var remainingSeconds by remember { mutableIntStateOf(totalSeconds) }
    var isRunning by remember { mutableStateOf(false) }
    var isZenMode by remember { mutableStateOf(false) }
    var showCelebration by remember { mutableStateOf(false) }
    var showCustomDurationDialog by remember { mutableStateOf(false) }
    var customMinutesInput by remember { mutableStateOf("") }
    var focusedSecondsAccumulated by remember { mutableIntStateOf(0) }

    // Accurate wall-clock timing calculation
    var targetEndTimeMillis by remember { mutableLongStateOf(0L) }

    LaunchedEffect(isRunning) {
        if (isRunning) {
            targetEndTimeMillis = System.currentTimeMillis() + (remainingSeconds * 1000L)
            while (isRunning && remainingSeconds > 0) {
                delay(500L)
                val diff = ((targetEndTimeMillis - System.currentTimeMillis()) / 1000L).toInt()
                if (diff >= 0) {
                    if (sessionMode == "Study") {
                        focusedSecondsAccumulated += (remainingSeconds - diff).coerceAtLeast(0)
                    }
                    remainingSeconds = diff
                } else {
                    remainingSeconds = 0
                }
            }
            if (remainingSeconds == 0 && isRunning) {
                isRunning = false

                // Sound & Vibration alert
                try {
                    if (repository.isTimerSoundEnabled()) {
                        val toneGen = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 100)
                        toneGen.startTone(ToneGenerator.TONE_PROP_BEEP2, 1000)
                    }
                    if (repository.isTimerVibrateEnabled()) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                            vibratorManager?.defaultVibrator?.vibrate(VibrationEffect.createOneShot(800L, VibrationEffect.DEFAULT_AMPLITUDE))
                        } else {
                            @Suppress("DEPRECATION")
                            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                            vibrator?.vibrate(800L)
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }

                // Log focus session to SQLite
                if (sessionMode == "Study") {
                    val completedMinutes = (totalSeconds / 60).coerceAtLeast(1)
                    repository.addFocusSession(
                        FocusSessionItem(
                            id = UUID.randomUUID().toString(),
                            subject = subjectName,
                            chapter = chapterTitle,
                            durationMinutes = completedMinutes,
                            timestamp = System.currentTimeMillis(),
                            mode = "Focus Block",
                            completed = true
                        )
                    )
                }

                showCelebration = true
            }
        }
    }

    val minutes = remainingSeconds / 60
    val seconds = remainingSeconds % 60
    val timeFormatted = String.format("%02d:%02d", minutes, seconds)
    val animatedProgress by animateFloatAsState(
        targetValue = if (totalSeconds > 0) (totalSeconds - remainingSeconds).toFloat() / totalSeconds.toFloat() else 0f,
        label = "TimerProgress"
    )

    // Zen Mode View
    if (isZenMode) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF0F172A))
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0x333B82F6)
                ) {
                    Text(
                        text = "🧘 ZEN IMMERSION • $subjectName",
                        color = Color(0xFF93C5FD),
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = chapterTitle,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(40.dp))

                // Zen Pulsating Dial
                Surface(
                    shape = CircleShape,
                    color = Color(0xFF1E293B),
                    shadowElevation = 16.dp,
                    modifier = Modifier.size(280.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(
                            progress = { animatedProgress },
                            modifier = Modifier.fillMaxSize().padding(14.dp),
                            strokeWidth = 12.dp,
                            color = if (sessionMode == "Study") RoyalBlueLight else EmeraldGreen,
                            trackColor = Color(0xFF334155)
                        )
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = timeFormatted,
                                fontSize = 54.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color.White
                            )
                            Text(
                                text = if (isRunning) "Deep Focus In Progress" else "Paused",
                                fontSize = 13.sp,
                                color = if (isRunning) EmeraldGreen else Color(0xFF94A3B8)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(40.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Button(
                        onClick = { isRunning = !isRunning },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isRunning) Color(0xFFEF4444) else RoyalBlueLight
                        ),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.height(52.dp).width(140.dp)
                    ) {
                        Text(if (isRunning) "⏸ Pause" else "▶ Resume", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
                    }

                    OutlinedButton(
                        onClick = { isZenMode = false },
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                        modifier = Modifier.height(52.dp)
                    ) {
                        Text("Exit Zen", fontSize = 14.sp)
                    }
                }
            }
        }
        return
    }

    // Standard Focus Timer View
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Focus Productivity Timer", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
                        Text(
                            text = if (sessionMode == "Study") "Deep Revision Session • Wall-clock math" else "Break Time • Rest & Rejuvenate",
                            fontSize = 11.sp,
                            color = Color(0xFFBAE6FD)
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClicked) {
                        Text(text = "←", fontSize = 22.sp, color = Color.White)
                    }
                },
                actions = {
                    IconButton(onClick = { isZenMode = true }) {
                        Text("🧘", fontSize = 20.sp)
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
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Mode Selector: Study vs Short Break vs Long Break
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 2.dp
                ) {
                    Row(modifier = Modifier.padding(4.dp)) {
                        listOf("Study", "Short Break", "Long Break").forEach { mode ->
                            val isSelected = sessionMode == mode
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = if (isSelected) RoyalBlue else Color.Transparent,
                                modifier = Modifier.clickable {
                                    if (!isRunning) {
                                        sessionMode = mode
                                        val mins = when (mode) {
                                            "Study" -> initialMinutes
                                            "Short Break" -> repository.getBreakDuration()
                                            else -> 15
                                        }
                                        totalSeconds = mins * 60
                                        remainingSeconds = totalSeconds
                                    } else {
                                        Toast.makeText(context, "Pause current timer to switch mode", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            ) {
                                Text(
                                    text = mode,
                                    fontSize = 12.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Surface(
                shape = RoundedCornerShape(10.dp),
                color = Color(0xFFDBEAFE)
            ) {
                Text(
                    text = subjectName,
                    fontWeight = FontWeight.Bold,
                    color = RoyalBlue,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = chapterTitle,
                fontSize = 19.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Dial Container
            Surface(
                shape = CircleShape,
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 8.dp,
                modifier = Modifier.size(250.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(
                        progress = { animatedProgress },
                        modifier = Modifier.fillMaxSize().padding(14.dp),
                        strokeWidth = 11.dp,
                        color = if (sessionMode == "Study") RoyalBlue else EmeraldGreen,
                        trackColor = Color(0xFFE2E8F0)
                    )
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = timeFormatted,
                            fontSize = 50.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = if (isRunning) {
                                if (sessionMode == "Study") "Deep Focus Active" else "Break in Progress"
                            } else "Timer Paused",
                            fontSize = 12.sp,
                            color = if (isRunning) EmeraldGreen else Color(0xFF64748B),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Presets Row
            Text("Timer Presets:", fontSize = 12.sp, color = Color(0xFF64748B), fontWeight = FontWeight.Medium)
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.padding(vertical = 2.dp)
            ) {
                listOf(15, 30, 45, 60, 90).forEach { mins ->
                    FilterChip(
                        selected = totalSeconds == mins * 60,
                        onClick = {
                            if (!isRunning) {
                                totalSeconds = mins * 60
                                remainingSeconds = totalSeconds
                            }
                        },
                        label = { Text("${mins}m", fontSize = 11.sp) }
                    )
                }
                FilterChip(
                    selected = false,
                    onClick = {
                        if (!isRunning) {
                            showCustomDurationDialog = true
                        }
                    },
                    label = { Text("Custom...", fontSize = 11.sp) }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Primary Playback Controls
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = { isRunning = !isRunning },
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isRunning) Color(0xFFEF4444) else RoyalBlue
                    ),
                    modifier = Modifier
                        .width(150.dp)
                        .height(52.dp)
                ) {
                    Text(
                        text = if (isRunning) "⏸ Pause" else "▶ Start Focus",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = Color.White
                    )
                }

                OutlinedButton(
                    onClick = {
                        isRunning = false
                        remainingSeconds = totalSeconds
                    },
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .width(95.dp)
                        .height(52.dp)
                ) {
                    Text("Reset", fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Quick Actions: Complete Chapter & Floating Window
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = {
                        isRunning = false
                        showCelebration = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f).height(46.dp)
                ) {
                    Text("✓ Complete Chapter", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }

                OutlinedButton(
                    onClick = { isZenMode = true },
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f).height(46.dp)
                ) {
                    Text("🧘 Zen Mode", fontSize = 12.sp)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(
                onClick = {
                    if (Settings.canDrawOverlays(context)) {
                        val serviceIntent = Intent(context, FloatingTimerService::class.java).apply {
                            action = FloatingTimerService.ACTION_START
                            putExtra(FloatingTimerService.EXTRA_SECONDS, remainingSeconds)
                            putExtra(FloatingTimerService.EXTRA_SUBJECT, subjectName)
                            putExtra(FloatingTimerService.EXTRA_CHAPTER, chapterTitle)
                        }
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            context.startForegroundService(serviceIntent)
                        } else {
                            context.startService(serviceIntent)
                        }
                        onBackClicked()
                    } else {
                        val intent = Intent(
                            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:${context.packageName}")
                        )
                        context.startActivity(intent)
                    }
                },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = RoyalBlue),
                modifier = Modifier.fillMaxWidth().height(46.dp)
            ) {
                Text("⚡ Floating Timer (Over Other Apps)", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }

    // Custom Duration Dialog
    if (showCustomDurationDialog) {
        AlertDialog(
            onDismissRequest = { showCustomDurationDialog = false },
            title = { Text("Set Custom Timer Duration", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("Enter duration in minutes (1–180 minutes):", fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = customMinutesInput,
                        onValueChange = { customMinutesInput = it.filter { ch -> ch.isDigit() } },
                        placeholder = { Text("e.g. 50") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val mins = customMinutesInput.toIntOrNull() ?: 45
                        val safeMins = mins.coerceIn(1, 180)
                        totalSeconds = safeMins * 60
                        remainingSeconds = totalSeconds
                        showCustomDurationDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                ) {
                    Text("Apply", color = Color.White)
                }
            },
            dismissButton = {
                OutlinedButton(onClick = { showCustomDurationDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Celebration Dialog
    if (showCelebration) {
        val completedMins = (totalSeconds / 60).coerceAtLeast(1)
        AlertDialog(
            onDismissRequest = {
                showCelebration = false
                onSessionCompleted()
            },
            title = {
                Text(text = "🎉 Focus Session Completed!", fontWeight = FontWeight.Bold, fontSize = 20.sp)
            },
            text = {
                Column {
                    Text(
                        text = "Outstanding work! You have dedicated $completedMins minutes of focused study to $chapterTitle.",
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "✓ Logged in SQLite focus session history\n✓ Study streak and syllabus metrics updated",
                        fontSize = 13.sp,
                        color = EmeraldGreen,
                        fontWeight = FontWeight.SemiBold,
                        lineHeight = 18.sp
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showCelebration = false
                        onSessionCompleted()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
                ) {
                    Text("Continue", color = Color.White)
                }
            }
        )
    }
}
