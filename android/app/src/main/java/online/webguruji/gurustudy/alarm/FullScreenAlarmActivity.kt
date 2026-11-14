package online.webguruji.gurustudy.alarm

import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import online.webguruji.gurustudy.MainActivity
import online.webguruji.gurustudy.data.repository.StudyRepository

class FullScreenAlarmActivity : ComponentActivity() {

    private var mediaPlayer: MediaPlayer? = null
    private var ttsAnnouncer: TTSAnnouncer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Wake screen and show over keyguard/lock screen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
            )
        }

        val studentName = intent.getStringExtra(AlarmScheduler.EXTRA_STUDENT_NAME) ?: "Student"
        val subject = intent.getStringExtra(AlarmScheduler.EXTRA_SUBJECT) ?: "Class 10 Subject"
        val chapter = intent.getStringExtra(AlarmScheduler.EXTRA_CHAPTER) ?: "NCERT Chapter"
        val dayIndex = intent.getIntExtra(AlarmScheduler.EXTRA_DAY_INDEX, 1)
        val duration = intent.getIntExtra(AlarmScheduler.EXTRA_DURATION, 60)

        val slotIndex = intent.getIntExtra(AlarmScheduler.EXTRA_SLOT_INDEX, 0)

        // Play alarm sound
        try {
            val alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            mediaPlayer = MediaPlayer().apply {
                setDataSource(applicationContext, alarmUri)
                isLooping = true
                prepare()
                start()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Initialize TTS Announcer if enabled
        val repository = StudyRepository(this)
        val profile = repository.getUserProfile()
        if (repository.isVoiceAnnouncementEnabled()) {
            val speechText = if (profile.preferredLanguage == "hi") {
                "$studentName जी, अब आपका $subject का पाठ $chapter पढ़ने का समय हो गया है! GuruStudy पर पढ़ाई शुरू करें।"
            } else {
                "Hello $studentName, it is time to study $subject: $chapter on GuruStudy! Let's start learning."
            }

            ttsAnnouncer = TTSAnnouncer(this) {
                ttsAnnouncer?.speak(speechText)
            }
        }

        setContent {
            AlarmScreenContent(
                studentName = studentName,
                subject = subject,
                chapter = chapter,
                duration = duration,
                onStartStudy = {
                    stopAlarmAndAudio()
                    dismissFloatingReminder()
                    val mainIntent = Intent(this, MainActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                        putExtra("NAVIGATE_TO", "STUDY_TIMER")
                        putExtra("SUBJECT", subject)
                        putExtra("CHAPTER", chapter)
                        putExtra("DURATION", duration)
                        putExtra("DAY_INDEX", dayIndex)
                    }
                    startActivity(mainIntent)
                    finish()
                },
                onSnooze = {
                    stopAlarmAndAudio()
                    dismissFloatingReminder()
                    AlarmScheduler(this).scheduleSnoozeAlarm(dayIndex, studentName, subject, chapter, duration, slotIndex)
                    finish()
                },
                onDismiss = {
                    stopAlarmAndAudio()
                    dismissFloatingReminder()
                    finish()
                }
            )
        }
    }

    private fun dismissFloatingReminder() {
        try {
            val stopIntent = Intent(this, online.webguruji.gurustudy.service.FloatingStudyReminderService::class.java).apply {
                action = online.webguruji.gurustudy.service.FloatingStudyReminderService.ACTION_DISMISS_REMINDER
            }
            startService(stopIntent)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun stopAlarmAndAudio() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
        ttsAnnouncer?.stop()
    }

    override fun onDestroy() {
        super.onDestroy()
        stopAlarmAndAudio()
        ttsAnnouncer?.shutdown()
    }
}

@Composable
fun AlarmScreenContent(
    studentName: String,
    subject: String,
    chapter: String,
    duration: Int,
    onStartStudy: () -> Unit,
    onSnooze: () -> Unit,
    onDismiss: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF1E3A8A), // Royal Blue
                        Color(0xFF1E40AF),
                        Color(0xFF0F172A)  // Deep Navy
                    )
                )
            )
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxWidth()
        ) {
            // Animated Alarm Icon Badge
            Surface(
                shape = CircleShape,
                color = Color(0xFFFBBF24),
                modifier = Modifier.size(96.dp),
                shadowElevation = 8.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "⏰",
                        fontSize = 44.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "GuruStudy Smart Alarm",
                color = Color(0xFF93C5FD),
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Time to Study, $studentName!",
                color = Color.White,
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Study Task Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0x33FFFFFF)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = subject,
                        color = Color(0xFF38BDF8),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = chapter,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Medium,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Target Duration: $duration Minutes",
                        color = Color(0xFFE2E8F0),
                        fontSize = 14.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Action Buttons
            Button(
                onClick = onStartStudy,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)), // Emerald Green
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
            ) {
                Text(
                    text = "📖 Start Studying Now",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onSnooze,
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = Color.White
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                ) {
                    Text("💤 Snooze (10m)", fontSize = 14.sp)
                }

                Button(
                    onClick = onDismiss,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0x33EF4444)),
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .weight(1f)
                        .height(50.dp)
                ) {
                    Text("Dismiss", color = Color(0xFFFCA5A5), fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "Developed by HarshGuruJi | contact@webguruji.online",
                color = Color(0x99FFFFFF),
                fontSize = 11.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}
