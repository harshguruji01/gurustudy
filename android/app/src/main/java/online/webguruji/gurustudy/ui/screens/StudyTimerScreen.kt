package online.webguruji.gurustudy.ui.screens

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import kotlinx.coroutines.delay
import online.webguruji.gurustudy.service.FloatingTimerService
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudyTimerScreen(
    subjectName: String,
    chapterTitle: String,
    initialMinutes: Int = 45,
    onBackClicked: () -> Unit,
    onSessionCompleted: () -> Unit
) {
    var totalSeconds by remember { mutableIntStateOf(initialMinutes * 60) }
    var remainingSeconds by remember { mutableIntStateOf(totalSeconds) }
    var isRunning by remember { mutableStateOf(false) }
    var showCelebration by remember { mutableStateOf(false) }

    LaunchedEffect(isRunning, remainingSeconds) {
        if (isRunning && remainingSeconds > 0) {
            delay(1000L)
            remainingSeconds -= 1
        } else if (isRunning && remainingSeconds == 0) {
            isRunning = false
            showCelebration = true
        }
    }

    val minutes = remainingSeconds / 60
    val seconds = remainingSeconds % 60
    val timeFormatted = String.format("%02d:%02d", minutes, seconds)
    val progress = if (totalSeconds > 0) (totalSeconds - remainingSeconds).toFloat() / totalSeconds.toFloat() else 0f

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text("Focus Study Timer", fontWeight = FontWeight.Bold, color = Color.White)
                },
                navigationIcon = {
                    IconButton(onClick = onBackClicked) {
                        Text(text = "←", fontSize = 22.sp, color = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = RoyalBlue)
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFDBEAFE)
                ) {
                    Text(
                        text = subjectName,
                        fontWeight = FontWeight.Bold,
                        color = RoyalBlue,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = chapterTitle,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Timer Circular Dial Container
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 8.dp,
                    modifier = Modifier.size(240.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(
                            progress = { progress },
                            modifier = Modifier.fillMaxSize().padding(12.dp),
                            strokeWidth = 10.dp,
                            color = RoyalBlue,
                            trackColor = Color(0xFFE2E8F0)
                        )
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = timeFormatted,
                                fontSize = 48.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = if (isRunning) "Deep Focus Active" else "Timer Paused",
                                fontSize = 12.sp,
                                color = if (isRunning) EmeraldGreen else Color(0xFF64748B),
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(36.dp))

                // Controls
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Button(
                        onClick = { isRunning = !isRunning },
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isRunning) Color(0xFFEF4444) else RoyalBlue
                        ),
                        modifier = Modifier
                            .width(140.dp)
                            .height(50.dp)
                    ) {
                        Text(
                            text = if (isRunning) "⏸ Pause" else "▶ Start",
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
                            .width(100.dp)
                            .height(50.dp)
                    ) {
                        Text("Reset", fontSize = 14.sp)
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        isRunning = false
                        showCelebration = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldGreen),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("✓ Mark Chapter Complete", color = Color.White, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(14.dp))

                val context = LocalContext.current
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
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = RoyalBlue)
                ) {
                    Text("⚡ Floating Timer (Over Other Apps)", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }

    // Celebration Dialog
    if (showCelebration) {
        AlertDialog(
            onDismissRequest = {
                showCelebration = false
                onSessionCompleted()
            },
            title = {
                Text(text = "🎉 Chapter Complete!", fontWeight = FontWeight.Bold, fontSize = 20.sp)
            },
            text = {
                Column {
                    Text(
                        text = "Awesome work! You have successfully completed your study session for $chapterTitle.",
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Your daily study streak and syllabus completion have been updated.",
                        fontSize = 13.sp,
                        color = EmeraldGreen,
                        fontWeight = FontWeight.SemiBold
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
