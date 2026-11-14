package online.webguruji.gurustudy.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import online.webguruji.gurustudy.GuruStudyApp
import online.webguruji.gurustudy.MainActivity
import online.webguruji.gurustudy.R

class FloatingTimerService : Service() {

    private var windowManager: WindowManager? = null
    private var floatingView: View? = null
    private var params: WindowManager.LayoutParams? = null

    private var remainingSeconds = 45 * 60
    private var isRunning = true
    private var subjectName = "Class 10"
    private var chapterTitle = "Study Session"

    private val handler = Handler(Looper.getMainLooper())
    private var timerRunnable: Runnable? = null

    companion object {
        const val ACTION_START = "online.webguruji.gurustudy.ACTION_START_FLOATING_TIMER"
        const val ACTION_STOP = "online.webguruji.gurustudy.ACTION_STOP_FLOATING_TIMER"
        const val EXTRA_SECONDS = "extra_seconds"
        const val EXTRA_SUBJECT = "extra_subject"
        const val EXTRA_CHAPTER = "extra_chapter"

        var isServiceRunning = false
            private set
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopSelf()
            return START_NOT_STICKY
        }

        subjectName = intent?.getStringExtra(EXTRA_SUBJECT) ?: "Class 10"
        chapterTitle = intent?.getStringExtra(EXTRA_CHAPTER) ?: "Focus Study"
        val sec = intent?.getIntExtra(EXTRA_SECONDS, 45 * 60) ?: (45 * 60)
        remainingSeconds = if (sec > 0) sec else 45 * 60

        startForeground(1001, createNotification())
        isServiceRunning = true

        if (Settings.canDrawOverlays(this)) {
            showFloatingBubble()
            startTimerLoop()
        } else {
            stopSelf()
        }

        return START_NOT_STICKY
    }

    private fun createNotification(): Notification {
        val openAppIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra("NAVIGATE_TO", "STUDY_TIMER")
        }
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, GuruStudyApp.TIMER_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("⏱️ Study Timer: $subjectName")
            .setContentText("$chapterTitle — Active Floating Mode")
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun showFloatingBubble() {
        if (floatingView != null) return

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 80
            y = 220
        }

        // Programmatic Floating Widget View
        val context = this
        val rootLayout = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dpToPx(12), dpToPx(8), dpToPx(12), dpToPx(8))

            // Background Shape: Smooth Pill #0F172A with #38BDF8 Border
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dpToPx(24).toFloat()
                setColor(Color.parseColor("#0F172A"))
                setStroke(dpToPx(1), Color.parseColor("#38BDF8"))
            }
            elevation = dpToPx(8).toFloat()
        }

        // Icon
        val iconView = TextView(context).apply {
            text = "⏱️"
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
            setPadding(0, 0, dpToPx(6), 0)
        }
        rootLayout.addView(iconView)

        // Time Text
        val timeTextView = TextView(context).apply {
            id = View.generateViewId()
            text = formatTime(remainingSeconds)
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setPadding(0, 0, dpToPx(8), 0)
        }
        rootLayout.addView(timeTextView)

        // Play/Pause Button
        val playPauseBtn = TextView(context).apply {
            text = "⏸️"
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            setPadding(dpToPx(4), 0, dpToPx(8), 0)
            setOnClickListener {
                isRunning = !isRunning
                text = if (isRunning) "⏸️" else "▶️"
            }
        }
        rootLayout.addView(playPauseBtn)

        // Close Button
        val closeBtn = TextView(context).apply {
            text = "✕"
            setTextColor(Color.parseColor("#94A3B8"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setPadding(dpToPx(4), 0, dpToPx(4), 0)
            setOnClickListener {
                stopSelf()
            }
        }
        rootLayout.addView(closeBtn)

        // Touch & Drag Handling
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f
        var isClick = false

        rootLayout.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params?.x ?: 0
                    initialY = params?.y ?: 0
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    isClick = true
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - initialTouchX).toInt()
                    val dy = (event.rawY - initialTouchY).toInt()
                    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                        isClick = false
                    }
                    params?.let { p ->
                        p.x = initialX + dx
                        p.y = initialY + dy
                        windowManager?.updateViewLayout(rootLayout, p)
                    }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (isClick) {
                        // Open main activity and go to timer screen
                        val intent = Intent(this, MainActivity::class.java).apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
                            putExtra("NAVIGATE_TO", "STUDY_TIMER")
                            putExtra("ALARM_SUBJECT", subjectName)
                            putExtra("ALARM_CHAPTER", chapterTitle)
                            putExtra("ALARM_DURATION", remainingSeconds / 60)
                        }
                        startActivity(intent)
                    }
                    true
                }
                else -> false
            }
        }

        floatingView = rootLayout
        try {
            windowManager?.addView(floatingView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun startTimerLoop() {
        timerRunnable = object : Runnable {
            override fun run() {
                if (isRunning && remainingSeconds > 0) {
                    remainingSeconds--
                    floatingView?.let { view ->
                        val timeTv = view.findViewById<TextView>(view.id + 1)
                        if (timeTv != null) {
                            timeTv.text = formatTime(remainingSeconds)
                        } else {
                            // Find child TextView
                            if (view is LinearLayout && view.childCount >= 2) {
                                (view.getChildAt(1) as? TextView)?.text = formatTime(remainingSeconds)
                            }
                        }
                    }
                    handler.postDelayed(this, 1000L)
                } else if (remainingSeconds <= 0) {
                    // Finished
                    stopSelf()
                } else {
                    handler.postDelayed(this, 1000L)
                }
            }
        }
        handler.post(timerRunnable!!)
    }

    private fun formatTime(sec: Int): String {
        val m = sec / 60
        val s = sec % 60
        return String.format("%02d:%02d", m, s)
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * resources.displayMetrics.density).toInt()
    }

    override fun onDestroy() {
        super.onDestroy()
        isServiceRunning = false
        timerRunnable?.let { handler.removeCallbacks(it) }
        floatingView?.let {
            try {
                windowManager?.removeView(it)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        floatingView = null
    }
}
