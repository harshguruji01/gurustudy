package online.webguruji.gurustudy.ui.screens

import android.widget.Toast
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
import online.webguruji.gurustudy.data.model.NcertChapter
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.model.NcertBook
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import online.webguruji.gurustudy.ui.theme.RoyalBlueLight
import online.webguruji.gurustudy.ui.theme.SepiaBackground
import online.webguruji.gurustudy.ui.theme.SepiaSurface
import online.webguruji.gurustudy.ui.theme.SepiaText

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChapterDetailScreen(
    subject: NcertSubject,
    chapter: NcertChapter,
    onBackClicked: () -> Unit,
    onStartStudyTimer: (NcertSubject, NcertChapter) -> Unit,
    onSelectNextChapter: ((NcertChapter) -> Unit)? = null,
    onSelectPrevChapter: ((NcertChapter) -> Unit)? = null
) {
    val context = LocalContext.current
    val repository = remember { StudyRepository(context) }

    // Auto-record last opened chapter in preferences
    LaunchedEffect(chapter) {
        repository.setLastRead(subject.name, chapter.title)
    }

    var selectedTab by remember { mutableIntStateOf(0) } // 0: Summary, 1: Formulas, 2: Questions, 3: MCQs, 4: Notes
    var currentStatus by remember { mutableStateOf(chapter.safeStatus) }
    var readingTheme by remember { mutableStateOf(repository.getReaderTheme()) } // "light", "sepia", "dark"
    var fontSizeDelta by remember { mutableFloatStateOf(0f) } // -2f, 0f, 3f
    var isFullScreen by remember { mutableStateOf(false) }
    var isBookmarked by remember { mutableStateOf(chapter.isBookmarked) }
    var personalNotes by remember {
        mutableStateOf(
            context.getSharedPreferences("gurustudy_notes", android.content.Context.MODE_PRIVATE)
                .getString("notes_${subject.id}_${chapter.number}", "") ?: ""
        )
    }
    var chapterSearchQuery by remember { mutableStateOf("") }

    // Color tokens based on selected reading theme
    val (themeBg, themeSurface, themeText, themeBorder) = when (readingTheme) {
        "sepia" -> Quadruple(SepiaBackground, SepiaSurface, SepiaText, Color(0xFFE2D1B3))
        "dark" -> Quadruple(Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFFF8FAFC), Color(0xFF334155))
        else -> Quadruple(Color(0xFFF8FAFC), Color.White, Color(0xFF0F172A), Color(0xFFE2E8F0))
    }

    val baseFontSize = (14f + fontSizeDelta).sp
    val baseLineHeight = (22f + fontSizeDelta * 1.5f).sp

    Scaffold(
        topBar = {
            if (!isFullScreen) {
                TopAppBar(
                    title = {
                        Column {
                            Text(
                                text = "Ch ${chapter.number}: ${chapter.title}",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "${subject.name} • Class 10 NCERT",
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
                        IconButton(onClick = {
                            isBookmarked = !isBookmarked
                            chapter.isBookmarked = isBookmarked
                            Toast.makeText(context, if (isBookmarked) "⭐ Bookmarked chapter!" else "Bookmark removed", Toast.LENGTH_SHORT).show()
                        }) {
                            Text(if (isBookmarked) "⭐" else "☆", fontSize = 18.sp)
                        }
                        IconButton(onClick = { isFullScreen = true }) {
                            Text("⛶", fontSize = 18.sp, color = Color.White)
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = RoyalBlue)
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(if (isFullScreen) PaddingValues(0.dp) else paddingValues)
                .background(themeBg)
        ) {
            // Fullscreen Exit Floating Banner
            if (isFullScreen) {
                Surface(
                    color = RoyalBlue.copy(alpha = 0.9f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "📖 Fullscreen Reading Mode • Ch ${chapter.number}: ${chapter.title}",
                            fontSize = 12.sp,
                            color = Color.White,
                            fontWeight = FontWeight.SemiBold
                        )
                        IconButton(onClick = { isFullScreen = false }, modifier = Modifier.size(28.dp)) {
                            Text("✕", color = Color.White, fontSize = 14.sp)
                        }
                    }
                }
            }

            // Reader Customization Bar: Theme, Font Size & Timer Shortcut
            Surface(
                color = themeSurface,
                shadowElevation = 1.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Theme Chips
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        FilterChip(
                            selected = readingTheme == "light",
                            onClick = {
                                readingTheme = "light"
                                repository.setReaderTheme("light")
                            },
                            label = { Text("☀️ Light", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = readingTheme == "sepia",
                            onClick = {
                                readingTheme = "sepia"
                                repository.setReaderTheme("sepia")
                            },
                            label = { Text("📜 Sepia", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = readingTheme == "dark",
                            onClick = {
                                readingTheme = "dark"
                                repository.setReaderTheme("dark")
                            },
                            label = { Text("🌙 Dark", fontSize = 10.sp) }
                        )
                    }

                    // Font Resizer & Timer Button
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        FilterChip(
                            selected = fontSizeDelta == -2f,
                            onClick = { fontSizeDelta = -2f },
                            label = { Text("A-", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = fontSizeDelta == 0f,
                            onClick = { fontSizeDelta = 0f },
                            label = { Text("A", fontSize = 10.sp) }
                        )
                        FilterChip(
                            selected = fontSizeDelta == 3f,
                            onClick = { fontSizeDelta = 3f },
                            label = { Text("A+", fontSize = 10.sp) }
                        )

                        Button(
                            onClick = { onStartStudyTimer(subject, chapter) },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text("⏱️ Focus", fontSize = 11.sp, color = Color.White)
                        }
                    }
                }
            }

            // Tab Navigation
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = themeSurface
            ) {
                Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Summary", fontSize = 12.sp) })
                Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }, text = { Text("Formulas", fontSize = 12.sp) })
                Tab(selected = selectedTab == 2, onClick = { selectedTab = 2 }, text = { Text("Questions", fontSize = 12.sp) })
                Tab(selected = selectedTab == 3, onClick = { selectedTab = 3 }, text = { Text("MCQs", fontSize = 12.sp) })
                Tab(selected = selectedTab == 4, onClick = { selectedTab = 4 }, text = { Text("Notes", fontSize = 12.sp) })
            }

            // Tab Content
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                when (selectedTab) {
                    0 -> {
                        // Summary & Key Concepts
                        Text(
                            text = "Chapter Summary (English & हिंदी)",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (readingTheme == "dark") RoyalBlueLight else RoyalBlue
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Card(
                            colors = CardDefaults.cardColors(containerColor = themeSurface),
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, themeBorder),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = chapter.summary,
                                    fontSize = baseFontSize,
                                    lineHeight = baseLineHeight,
                                    color = themeText
                                )
                                Spacer(modifier = Modifier.height(14.dp))
                                Text(
                                    text = chapter.summaryHi,
                                    fontSize = baseFontSize,
                                    lineHeight = baseLineHeight,
                                    color = themeText.copy(alpha = 0.85f)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Text(
                            text = "Key Concepts & Learning Objectives",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (readingTheme == "dark") RoyalBlueLight else RoyalBlue
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        chapter.keyConcepts.forEach { concept ->
                            Card(
                                colors = CardDefaults.cardColors(containerColor = themeSurface),
                                shape = RoundedCornerShape(10.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, themeBorder),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(modifier = Modifier.padding(12.dp)) {
                                    Text("📌 ", fontSize = 14.sp)
                                    Text(
                                        text = concept,
                                        fontSize = baseFontSize,
                                        lineHeight = baseLineHeight,
                                        color = themeText
                                    )
                                }
                            }
                        }
                    }

                    1 -> {
                        // Formulas / Important Definitions
                        Text(
                            text = "Important Formulas & Definitions",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (readingTheme == "dark") RoyalBlueLight else RoyalBlue
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        if (chapter.formulas.isEmpty()) {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = themeSurface),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "All key definitions and core terminology for this chapter are integrated into the Summary & Key Concepts section.",
                                    fontSize = baseFontSize,
                                    color = themeText.copy(alpha = 0.8f),
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                        } else {
                            chapter.formulas.forEach { formula ->
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = themeSurface),
                                    shape = RoundedCornerShape(10.dp),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, themeBorder),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Row(modifier = Modifier.padding(14.dp)) {
                                        Text("📐 ", fontSize = 14.sp)
                                        Text(
                                            text = formula,
                                            fontSize = baseFontSize,
                                            fontWeight = FontWeight.SemiBold,
                                            lineHeight = baseLineHeight,
                                            color = themeText
                                        )
                                    }
                                }
                            }
                        }
                    }

                    2 -> {
                        // Important Subjective Questions
                        Text(
                            text = "High-Yield CBSE Board Examination Questions",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (readingTheme == "dark") RoyalBlueLight else RoyalBlue
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        chapter.importantQuestions.forEachIndexed { idx, q ->
                            var showSolution by remember { mutableStateOf(false) }
                            Card(
                                colors = CardDefaults.cardColors(containerColor = themeSurface),
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, themeBorder),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 6.dp)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = "Q${idx + 1} (${q.marks} Marks)",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = RoyalBlue
                                        )
                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = Color(0xFFEFF6FF)
                                        ) {
                                            Text(
                                                text = "${q.marks} Marks",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = RoyalBlue,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = q.question,
                                        fontSize = baseFontSize,
                                        fontWeight = FontWeight.Medium,
                                        lineHeight = baseLineHeight,
                                        color = themeText
                                    )
                                    if (q.questionHi.isNotBlank()) {
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = q.questionHi,
                                            fontSize = baseFontSize,
                                            lineHeight = baseLineHeight,
                                            color = themeText.copy(alpha = 0.75f)
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(10.dp))
                                    OutlinedButton(
                                        onClick = { showSolution = !showSolution },
                                        shape = RoundedCornerShape(8.dp)
                                    ) {
                                        Text(if (showSolution) "Hide Solution" else "View Model Solution", fontSize = 12.sp)
                                    }
                                    if (showSolution) {
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Surface(
                                            color = if (readingTheme == "dark") Color(0xFF334155) else Color(0xFFF1F5F9),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Text(
                                                text = q.solution,
                                                fontSize = baseFontSize,
                                                lineHeight = baseLineHeight,
                                                color = themeText,
                                                modifier = Modifier.padding(12.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    3 -> {
                        // MCQs
                        Text(
                            text = "Chapter Multiple Choice Questions (MCQs)",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (readingTheme == "dark") RoyalBlueLight else RoyalBlue
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        chapter.mcqs.forEachIndexed { qIdx, mcq ->
                            var selectedOption by remember { mutableStateOf<Int?>(null) }
                            Card(
                                colors = CardDefaults.cardColors(containerColor = themeSurface),
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, themeBorder),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 6.dp)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text(
                                        text = "Q${qIdx + 1}. ${mcq.question}",
                                        fontSize = baseFontSize,
                                        fontWeight = FontWeight.SemiBold,
                                        lineHeight = baseLineHeight,
                                        color = themeText
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    mcq.options.forEachIndexed { optIdx, opt ->
                                        val isChosen = selectedOption == optIdx
                                        val isCorrect = optIdx == mcq.correctIndex
                                        val bgOpt = when {
                                            selectedOption == null -> Color.Transparent
                                            isChosen && isCorrect -> Color(0xFFDCFCE7)
                                            isChosen && !isCorrect -> Color(0xFFFEE2E2)
                                            isCorrect -> Color(0xFFDCFCE7)
                                            else -> Color.Transparent
                                        }
                                        Surface(
                                            shape = RoundedCornerShape(8.dp),
                                            color = bgOpt,
                                            border = androidx.compose.foundation.BorderStroke(1.dp, themeBorder),
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(vertical = 3.dp)
                                                .clickable {
                                                    if (selectedOption == null) selectedOption = optIdx
                                                }
                                        ) {
                                            Row(
                                                modifier = Modifier.padding(10.dp),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Text(
                                                    text = "${('A' + optIdx)}. $opt",
                                                    fontSize = baseFontSize,
                                                    color = themeText
                                                )
                                            }
                                        }
                                    }
                                    if (selectedOption != null) {
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = "💡 Explanation: ${mcq.explanation}",
                                            fontSize = 12.sp,
                                            lineHeight = 18.sp,
                                            color = themeText.copy(alpha = 0.8f)
                                        )
                                    }
                                }
                            }
                        }
                    }

                    4 -> {
                        // Personal Notes Tab
                        Text(
                            text = "My Personal Notes for this Chapter",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (readingTheme == "dark") RoyalBlueLight else RoyalBlue
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Write your key formulas, mnemonics, or tricky problems here. Saved offline on your device.",
                            fontSize = 12.sp,
                            color = themeText.copy(alpha = 0.7f)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        OutlinedTextField(
                            value = personalNotes,
                            onValueChange = { personalNotes = it },
                            placeholder = { Text("Write personal study notes...") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(220.dp),
                            shape = RoundedCornerShape(12.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = {
                                context.getSharedPreferences("gurustudy_notes", android.content.Context.MODE_PRIVATE)
                                    .edit()
                                    .putString("notes_${subject.id}_${chapter.number}", personalNotes)
                                    .apply()
                                Toast.makeText(context, "Notes saved successfully!", Toast.LENGTH_SHORT).show()
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth().height(46.dp)
                        ) {
                            Text("💾 Save Notes", color = Color.White, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Bottom Prev / Next Chapter Navigation
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    if (onSelectPrevChapter != null) {
                        OutlinedButton(
                            onClick = { /* Will be wired if available */ },
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("◀ Prev Chapter", fontSize = 12.sp)
                        }
                    } else {
                        Spacer(modifier = Modifier.width(10.dp))
                    }

                    Button(
                        onClick = {
                            currentStatus = if (currentStatus == "Completed") "Not Started" else "Completed"
                            chapter.progressStatus = currentStatus
                            Toast.makeText(context, "Status: $currentStatus", Toast.LENGTH_SHORT).show()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (currentStatus == "Completed") EmeraldGreen else RoyalBlue
                        ),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(
                            text = if (currentStatus == "Completed") "✓ Completed" else "Mark Chapter Done",
                            color = Color.White,
                            fontSize = 12.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}

data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)
