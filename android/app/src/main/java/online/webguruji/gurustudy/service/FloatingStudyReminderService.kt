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
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import online.webguruji.gurustudy.GuruStudyApp
import online.webguruji.gurustudy.MainActivity
import online.webguruji.gurustudy.R
import online.webguruji.gurustudy.alarm.AlarmScheduler

class FloatingStudyReminderService : Service() {

    private var windowManager: WindowManager? = null
    private var reminderCardView: View? = null
    private var params: WindowManager.LayoutParams? = null

    private val handler = Handler(Looper.getMainLooper())
    private var autoDismissRunnable: Runnable? = null

    companion object {
        const val ACTION_SHOW_REMINDER = "online.webguruji.gurustudy.ACTION_SHOW_FLOATING_REMINDER"
        const val ACTION_DISMISS_REMINDER = "online.webguruji.gurustudy.ACTION_DISMISS_FLOATING_REMINDER"

        const val EXTRA_STUDENT_NAME = "extra_student_name"
        const val EXTRA_SUBJECT = "extra_subject"
        const val EXTRA_CHAPTER = "extra_chapter"
        const val EXTRA_DURATION = "extra_duration"
        const val EXTRA_DAY_INDEX = "extra_day_index"
        const val EXTRA_SLOT_INDEX = "extra_slot_index"

        var isShowing = false
            private set
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_DISMISS_REMINDER) {
            stopSelf()
            return START_NOT_STICKY
        }

        // Overlay permission verification
        if (!Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }

        val studentName = intent?.getStringExtra(EXTRA_STUDENT_NAME) ?: "Student"
        val subject = intent?.getStringExtra(EXTRA_SUBJECT) ?: "Mathematics"
        val chapter = intent?.getStringExtra(EXTRA_CHAPTER) ?: "Quadratic Equations"
        val duration = intent?.getIntExtra(EXTRA_DURATION, 60) ?: 60
        val dayIndex = intent?.getIntExtra(EXTRA_DAY_INDEX, 1) ?: 1
        val slotIndex = intent?.getIntExtra(EXTRA_SLOT_INDEX, 0) ?: 0

        startForeground(1002, createNotification(subject, chapter))
        isShowing = true

        showReminderOverlay(
            studentName = studentName,
            subject = subject,
            chapter = chapter,
            duration = duration,
            dayIndex = dayIndex,
            slotIndex = slotIndex
        )

        // Auto-dismiss after 3 minutes (180,000ms) to avoid permanently lingering
        autoDismissRunnable?.let { handler.removeCallbacks(it) }
        autoDismissRunnable = Runnable {
            stopSelf()
        }
        handler.postDelayed(autoDismissRunnable!!, 180000L)

        return START_NOT_STICKY
    }

    private fun createNotification(subject: String, chapter: String): Notification {
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

        return NotificationCompat.Builder(this, GuruStudyApp.ALARM_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("⏰ Study Reminder: $subject")
            .setContentText("$chapter — Starting now")
            .setContentIntent(pendingIntent)
            .setOngoing(false)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
    }

    private fun showReminderOverlay(
        studentName: String,
        subject: String,
        chapter: String,
        duration: Int,
        dayIndex: Int,
        slotIndex: Int
    ) {
        if (reminderCardView != null) {
            try {
                windowManager?.removeView(reminderCardView)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        params = WindowManager.LayoutParams(
            dpToPx(320),
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
            x = 0
            y = dpToPx(80)
        }

        val cardLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dpToPx(16), dpToPx(16), dpToPx(16), dpToPx(16))
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dpToPx(18).toFloat()
                setColor(Color.parseColor("#0F172A")) // Modern dark navy
                setStroke(dpToPx(1), Color.parseColor("#38BDF8")) // Subtle neon cyan border
            }
            elevation = dpToPx(12).toFloat()
        }

        // Header: Badge + Title + Close Button
        val headerLayout = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
        }

        val iconBadge = TextView(this).apply {
            text = "⏰"
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
            setPadding(0, 0, dpToPx(8), 0)
        }
        headerLayout.addView(iconBadge)

        val titleView = TextView(this).apply {
            text = "GuruStudy Study Reminder"
            setTextColor(Color.parseColor("#93C5FD"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
        }
        headerLayout.addView(titleView)

        val closeBtn = TextView(this).apply {
            text = "✕"
            setTextColor(Color.parseColor("#94A3B8"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setPadding(dpToPx(6), dpToPx(2), dpToPx(6), dpToPx(2))
            setOnClickListener {
                stopSelf()
            }
        }
        headerLayout.addView(closeBtn)
        cardLayout.addView(headerLayout)

        // Subject Tag
        val subjectTag = TextView(this).apply {
            text = subject.uppercase()
            setTextColor(Color.parseColor("#38BDF8"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 11f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setPadding(0, dpToPx(10), 0, dpToPx(2))
        }
        cardLayout.addView(subjectTag)

        // Chapter / Topic Headline
        val chapterView = TextView(this).apply {
            text = chapter
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            maxLines = 2
            setPadding(0, 0, 0, dpToPx(4))
        }
        cardLayout.addView(chapterView)

        // Duration & Greeting details
        val detailView = TextView(this).apply {
            text = "$duration Mins Session • Scheduled for $studentName"
            setTextColor(Color.parseColor("#94A3B8"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            setPadding(0, 0, 0, dpToPx(14))
        }
        cardLayout.addView(detailView)

        // Primary Button: "Start Studying Now"
        val startBtn = Button(this).apply {
            text = "📖 Start Studying Now"
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dpToPx(10).toFloat()
                setColor(Color.parseColor("#10B981")) // Emerald Green
            }
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                dpToPx(42)
            )
            setOnClickListener {
                val mainIntent = Intent(this@FloatingStudyReminderService, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    putExtra("NAVIGATE_TO", "STUDY_TIMER")
                    putExtra("SUBJECT", subject)
                    putExtra("CHAPTER", chapter)
                    putExtra("DURATION", duration)
                    putExtra("DAY_INDEX", dayIndex)
                }
                startActivity(mainIntent)
                stopSelf()
            }
        }
        cardLayout.addView(startBtn)

        // Secondary Buttons Row: Snooze (10m) & Dismiss
        val actionsRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                topMargin = dpToPx(8)
            }
        }

        val snoozeBtn = Button(this).apply {
            text = "💤 Snooze (10m)"
            setTextColor(Color.parseColor("#E2E8F0"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dpToPx(10).toFloat()
                setColor(Color.parseColor("#1E293B"))
                setStroke(dpToPx(1), Color.parseColor("#475569"))
            }
            layoutParams = LinearLayout.LayoutParams(0, dpToPx(38), 1f).apply {
                marginEnd = dpToPx(6)
            }
            setOnClickListener {
                AlarmScheduler(this@FloatingStudyReminderService).scheduleSnoozeAlarm(
                    dayIndex = dayIndex,
                    studentName = studentName,
                    subject = subject,
                    chapter = chapter,
                    duration = duration,
                    slotIndex = slotIndex
                )
                stopSelf()
            }
        }
        actionsRow.addView(snoozeBtn)

        val dismissBtn = Button(this).apply {
            text = "Dismiss"
            setTextColor(Color.parseColor("#FCA5A5"))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                cornerRadius = dpToPx(10).toFloat()
                setColor(Color.parseColor("#3B1D28"))
                setStroke(dpToPx(1), Color.parseColor("#7F1D1D"))
            }
            layoutParams = LinearLayout.LayoutParams(0, dpToPx(38), 1f).apply {
                marginStart = dpToPx(6)
            }
            setOnClickListener {
                stopSelf()
            }
        }
        actionsRow.addView(dismissBtn)
        cardLayout.addView(actionsRow)

        // Drag listener for draggable overlay
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f

        cardLayout.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params?.x ?: 0
                    initialY = params?.y ?: 0
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - initialTouchX).toInt()
                    val dy = (event.rawY - initialTouchY).toInt()
                    params?.let { p ->
                        p.x = initialX + dx
                        p.y = initialY + dy
                        windowManager?.updateViewLayout(cardLayout, p)
                    }
                    true
                }
                else -> false
            }
        }

        reminderCardView = cardLayout
        try {
            windowManager?.addView(reminderCardView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * resources.displayMetrics.density).toInt()
    }

    override fun onDestroy() {
        super.onDestroy()
        isShowing = false
        autoDismissRunnable?.let { handler.removeCallbacks(it) }
        reminderCardView?.let {
            try {
                windowManager?.removeView(it)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        reminderCardView = null
    }
}
