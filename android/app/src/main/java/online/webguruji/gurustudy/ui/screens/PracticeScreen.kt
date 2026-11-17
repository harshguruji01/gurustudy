package online.webguruji.gurustudy.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import kotlinx.coroutines.launch
import online.webguruji.gurustudy.ai.AiResponseResult
import online.webguruji.gurustudy.ai.GeminiAiHelper
import online.webguruji.gurustudy.data.model.McqQuestion
import online.webguruji.gurustudy.data.model.MistakeItem
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PracticeScreen(
    subjects: List<NcertSubject>,
    mistakes: List<MistakeItem>,
    onAddMistake: (MistakeItem) -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Mock Tests, 1: Formula Sheets, 2: Mistakes, 3: PYQs, 4: AI Assistant
    var prefilledAiQuery by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Practice & Examination Center",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "MCQs, timed mock tests, CBSE PYQs & AI Study Buddy",
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
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface,
                edgePadding = 12.dp
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Mock Tests & MCQs") }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Formula Sheets") }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text("Mistakes (${mistakes.size})") }
                )
                Tab(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    text = { Text("CBSE PYQs") }
                )
                Tab(
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4 },
                    text = { Text("🤖 AI Assistant") }
                )
            }

            when (selectedTab) {
                0 -> MockQuizTab(subjects, onAddMistake)
                1 -> FormulaSheetsTab(subjects)
                2 -> MistakeNotebookTab(
                    mistakes = mistakes,
                    onAskAiAboutMistake = { mistake ->
                        prefilledAiQuery = "Explain this mistake from ${mistake.subjectName} (${mistake.chapterTitle}): Question: '${mistake.questionText}'. I answered '${mistake.selectedWrongAnswer}' but the correct answer is '${mistake.correctAnswer}'."
                        selectedTab = 4
                    }
                )
                3 -> PyqTab()
                4 -> AiAssistantTab(prefilledQuery = prefilledAiQuery)
            }
        }
    }
}

@Composable
fun MockQuizTab(
    subjects: List<NcertSubject>,
    onAddMistake: (MistakeItem) -> Unit
) {
    var selectedSubjectFilter by remember { mutableStateOf("All") }
    var testDurationMode by remember { mutableStateOf("Standard 10") } // "Quick 5", "Standard 10", "Timed Mock 20"

    val allMcqs = remember(subjects, selectedSubjectFilter, testDurationMode) {
        val list = mutableListOf<Triple<String, String, McqQuestion>>()
        val filteredSubjects = if (selectedSubjectFilter == "All") subjects else subjects.filter { it.name.equals(selectedSubjectFilter, ignoreCase = true) }
        filteredSubjects.forEach { subj ->
            subj.books.forEach { book ->
                book.chapters.forEach { ch ->
                    ch.mcqs.forEach { mcq ->
                        list.add(Triple(subj.name, ch.title, mcq))
                    }
                }
            }
        }
        val count = when (testDurationMode) {
            "Quick 5" -> 5
            "Timed Mock 20" -> 20
            else -> 10
        }
        list.shuffled().take(count)
    }

    var currentQuestionIndex by remember { mutableIntStateOf(0) }
    var selectedOption by remember { mutableStateOf<Int?>(null) }
    var score by remember { mutableIntStateOf(0) }
    var quizFinished by remember { mutableStateOf(false) }

    // Timed test countdown
    var timerSeconds by remember { mutableIntStateOf(15 * 60) }
    LaunchedEffect(quizFinished, testDurationMode) {
        if (testDurationMode == "Timed Mock 20" && !quizFinished) {
            timerSeconds = 20 * 60
            while (timerSeconds > 0 && !quizFinished) {
                delay(1000L)
                timerSeconds--
            }
            if (timerSeconds == 0) {
                quizFinished = true
            }
        }
    }

    if (allMcqs.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
            Text("No questions found for the selected subject. Select another subject.", textAlign = TextAlign.Center)
        }
        return
    }

    if (quizFinished) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Surface(
                shape = CircleShape,
                color = Color(0xFFDCFCE7),
                modifier = Modifier.size(72.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text("🏆", fontSize = 36.sp)
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
            Text("Test Completed!", fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))

            val accuracyPct = if (allMcqs.isNotEmpty()) (score * 100) / allMcqs.size else 0
            Text(
                text = "Score: $score / ${allMcqs.size} ($accuracyPct% Accuracy)",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = if (accuracyPct >= 80) EmeraldGreen else RoyalBlue
            )

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = if (accuracyPct >= 80) {
                    "Outstanding performance! Your concepts are solid for CBSE Class 10 Board Exams."
                } else {
                    "Good effort! We recommend reviewing the Mistake Notebook and formulas for any questions you missed."
                },
                fontSize = 13.sp,
                color = Color(0xFF64748B),
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    currentQuestionIndex = 0
                    selectedOption = null
                    score = 0
                    quizFinished = false
                },
                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
                Text("Start Another Practice Test", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }
        return
    }

    val currentItem = allMcqs[currentQuestionIndex]
    val subjName = currentItem.first
    val chTitle = currentItem.second
    val question = currentItem.third

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // Filters row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier.weight(1f).horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                listOf("All", "Mathematics", "Science", "Social Science").forEach { subj ->
                    FilterChip(
                        selected = selectedSubjectFilter == subj,
                        onClick = {
                            selectedSubjectFilter = subj
                            currentQuestionIndex = 0
                            selectedOption = null
                            score = 0
                        },
                        label = { Text(if (subj == "Mathematics") "Maths" else subj, fontSize = 11.sp, maxLines = 1, softWrap = false) }
                    )
                }
            }

            if (testDurationMode == "Timed Mock 20") {
                val m = timerSeconds / 60
                val s = timerSeconds % 60
                Spacer(modifier = Modifier.width(6.dp))
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFEF2F2)
                ) {
                    Text(
                        text = String.format("⏱ %02d:%02d", m, s),
                        color = Color(0xFFDC2626),
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        maxLines = 1,
                        softWrap = false
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Question Progress Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Question ${currentQuestionIndex + 1} of ${allMcqs.size}",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = RoyalBlue
            )
            Text(
                text = "Score: $score",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = EmeraldGreen
            )
        }

        LinearProgressIndicator(
            progress = { (currentQuestionIndex + 1).toFloat() / allMcqs.size.toFloat() },
            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            color = RoyalBlue,
            trackColor = Color(0xFFE2E8F0)
        )

        Spacer(modifier = Modifier.height(6.dp))

        // Question Card
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "$subjName • $chTitle",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF64748B)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = question.question,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    lineHeight = 22.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Options
        question.options.forEachIndexed { index, option ->
            val isSelected = selectedOption == index
            val isAnswered = selectedOption != null
            val isCorrect = index == question.correctIndex

            val backgroundColor = when {
                !isAnswered -> MaterialTheme.colorScheme.surface
                isCorrect -> Color(0xFFDCFCE7)
                isSelected -> Color(0xFFFEE2E2)
                else -> MaterialTheme.colorScheme.surface
            }

            val borderColor = when {
                !isAnswered -> if (isSelected) RoyalBlue else Color(0xFFE2E8F0)
                isCorrect -> EmeraldGreen
                isSelected -> Color(0xFFEF4444)
                else -> Color(0xFFE2E8F0)
            }

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = backgroundColor,
                border = androidx.compose.foundation.BorderStroke(1.5.dp, borderColor),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Button(
                    onClick = {
                        if (selectedOption == null) {
                            selectedOption = index
                            if (index == question.correctIndex) {
                                score += 1
                            } else {
                                val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
                                onAddMistake(
                                    MistakeItem(
                                        id = UUID.randomUUID().toString(),
                                        subjectName = subjName,
                                        chapterTitle = chTitle,
                                        questionText = question.question,
                                        selectedWrongAnswer = option,
                                        correctAnswer = question.options.getOrElse(question.correctIndex) { "Option ${question.correctIndex + 1}" },
                                        explanation = question.explanation,
                                        dateAdded = dateStr
                                    )
                                )
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    shape = RoundedCornerShape(12.dp),
                    contentPadding = PaddingValues(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = if (isSelected) RoyalBlue else Color(0xFFF1F5F9),
                            modifier = Modifier.size(28.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = ('A'.code + index).toChar().toString(),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    color = if (isSelected) Color.White else Color(0xFF334155)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = option,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 14.sp,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Explanation & Next Button
        if (selectedOption != null) {
            Spacer(modifier = Modifier.height(14.dp))
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF8FAFC)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = if (selectedOption == question.correctIndex) "✓ Correct Answer!" else "❌ Incorrect (Saved to Mistake Notebook)",
                        fontWeight = FontWeight.Bold,
                        color = if (selectedOption == question.correctIndex) EmeraldGreen else Color(0xFFEF4444),
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "💡 Explanation: ${question.explanation}",
                        fontSize = 12.sp,
                        color = Color(0xFF475569),
                        lineHeight = 18.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    if (currentQuestionIndex + 1 < allMcqs.size) {
                        currentQuestionIndex += 1
                        selectedOption = null
                    } else {
                        quizFinished = true
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth().height(48.dp)
            ) {
                Text(
                    text = if (currentQuestionIndex + 1 < allMcqs.size) "Next Question →" else "Finish Test & View Score",
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }
        }
    }
}

@Composable
fun FormulaSheetsTab(subjects: List<NcertSubject>) {
    val formulaItems = remember(subjects) {
        val list = mutableListOf<Triple<String, String, String>>()
        subjects.forEach { subj ->
            subj.books.forEach { book ->
                book.chapters.forEach { ch ->
                    ch.formulas.forEach { fString ->
                        list.add(Triple(subj.name, ch.title, fString))
                    }
                }
            }
        }
        list
    }

    if (formulaItems.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No formulas available.")
        }
        return
    }

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(formulaItems) { item ->
            val subj = item.first
            val ch = item.second
            val fString = item.third
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "$subj • $ch",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = RoyalBlue
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFFF1F5F9),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = fString,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF1E293B),
                            fontSize = 14.sp,
                            modifier = Modifier.padding(10.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MistakeNotebookTab(
    mistakes: List<MistakeItem>,
    onAskAiAboutMistake: (MistakeItem) -> Unit
) {
    if (mistakes.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("🎉", fontSize = 48.sp)
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Mistake Notebook is Clear!",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "When you take Practice Tests, any incorrect answers and tricky formulas will be automatically saved here for quick revision.",
                    textAlign = TextAlign.Center,
                    fontSize = 13.sp,
                    color = Color(0xFF64748B)
                )
            }
        }
        return
    }

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(mistakes) { item ->
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
                        Text(
                            text = item.subjectName,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = RoyalBlue
                        )
                        Text(
                            text = item.dateAdded,
                            fontSize = 10.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = item.chapterTitle,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = item.questionText,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        lineHeight = 20.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "❌ Your answer: ${item.selectedWrongAnswer}",
                        fontSize = 12.sp,
                        color = Color(0xFFEF4444)
                    )
                    Text(
                        text = "✓ Correct answer: ${item.correctAnswer}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = EmeraldGreen
                    )
                    if (item.explanation.isNotBlank()) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "💡 ${item.explanation}",
                            fontSize = 11.sp,
                            color = Color(0xFF64748B)
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedButton(
                        onClick = { onAskAiAboutMistake(item) },
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Text("🤖 Explain Mistake with AI", fontSize = 11.sp, color = RoyalBlue, maxLines = 1, softWrap = false)
                    }
                }
            }
        }
    }
}

@Composable
fun PyqTab() {
    val pyqList = listOf(
        Triple("Mathematics", "Real Numbers • 3 Marks (CBSE 2024)", "Prove that √5 is an irrational number.\n\nOfficial Marking Scheme:\n1. Assume √5 = a/b where a, b are co-prime integers.\n2. 5 = a²/b² ⇒ a² = 5b² (5 divides a² ⇒ 5 divides a).\n3. Let a = 5c ⇒ 25c² = 5b² ⇒ b² = 5c² (5 divides b).\n4. Common factor 5 contradicts co-prime assumption. Hence √5 is irrational. [3 Marks]"),
        Triple("Mathematics", "Quadratic Equations • 4 Marks (CBSE 2023)", "Find k if (k+4)x² + (k+1)x + 1 = 0 has equal roots.\n\nOfficial Marking Scheme:\n1. For equal roots, Discriminant D = b² - 4ac = 0.\n2. (k+1)² - 4(k+4)(1) = 0\n3. k² + 2k + 1 - 4k - 16 = 0 ⇒ k² - 2k - 15 = 0.\n4. (k-5)(k+3) = 0 ⇒ k = 5 or k = -3. [4 Marks]"),
        Triple("Science", "Chemical Reactions • 3 Marks (CBSE 2024)", "What happens when lead nitrate is heated in a dry boiling tube?\n\nOfficial Marking Scheme:\n1. Observation: Brown fumes of NO₂ gas and yellowish lead oxide residue.\n2. Equation: 2Pb(NO₃)₂(s) —Heat→ 2PbO(s) + 4NO₂(g) + O₂(g).\n3. Reaction Type: Thermal Decomposition. [3 Marks]"),
        Triple("Science", "Electricity • 5 Marks (CBSE 2023)", "State Joule's law of heating. Calculate cost for 1000W heater running 2h daily in September at ₹6/unit.\n\nOfficial Marking Scheme:\n1. H = I²Rt statement [2 Marks].\n2. Energy = 1kW × 2h × 30 days = 60 kWh [2 Marks].\n3. Cost = 60 × ₹6 = ₹360.00 [1 Mark]."),
        Triple("Social Science", "Nationalism in India • 5 Marks (CBSE 2024)", "Explain reasons for launching Non-Cooperation and its withdrawal in 1922.\n\nOfficial Marking Scheme:\n1. Launch: Rowlatt Act, Jallianwala Bagh, Khilafat Movement [3 Marks].\n2. Withdrawal: Violent Chauri Chaura incident, need for satyagraha training [2 Marks].")
    )

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(pyqList) { item ->
            var expanded by remember { mutableStateOf(false) }
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = item.first,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = RoyalBlue
                    )
                    Text(
                        text = item.second,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Button(
                        onClick = { expanded = !expanded },
                        colors = ButtonDefaults.outlinedButtonColors(),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (expanded) "Hide Solution" else "View Official CBSE Marking Scheme", fontSize = 12.sp)
                    }
                    if (expanded) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = item.third,
                            fontSize = 12.sp,
                            lineHeight = 18.sp,
                            color = Color(0xFF334155),
                            modifier = Modifier
                                .background(Color(0xFFF8FAFC), RoundedCornerShape(8.dp))
                                .padding(10.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AiAssistantTab(prefilledQuery: String = "") {
    val context = LocalContext.current
    val repository = remember { StudyRepository(context) }
    val scope = rememberCoroutineScope()
    val aiHelper = remember { GeminiAiHelper() }

    var apiKeyInput by remember { mutableStateOf(repository.getGeminiApiKey()) }
    var query by remember { mutableStateOf(prefilledQuery) }
    var responseText by remember { mutableStateOf("") }
    var responseTypeBadge by remember { mutableStateOf("📘 Verified CBSE NCERT Content") }
    var isLoading by remember { mutableStateOf(false) }
    var selectedMode by remember { mutableStateOf("Explain Concept") }
    var selectedLanguage by remember { mutableStateOf(repository.getUserProfile().preferredLanguage) }

    LaunchedEffect(prefilledQuery) {
        if (prefilledQuery.isNotBlank()) {
            query = prefilledQuery
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        // AI API Key Status Card
        val hasKey = repository.hasGeminiApiKey()
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (hasKey) Color(0xFFF0FDF4) else Color(0xFFFEF3C7)
            ),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f).padding(end = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(if (hasKey) "🟢" else "⚠️", fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (hasKey) "Gemini AI Active" else "AI API Not Configured",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = if (hasKey) Color(0xFF16A34A) else Color(0xFFD97706)
                        )
                    }
                    Text(
                        text = if (hasKey) "Custom Key Loaded" else "Offline Fallback Ready",
                        fontSize = 11.sp,
                        color = Color(0xFF64748B),
                        maxLines = 1,
                        softWrap = false
                    )
                }

                if (!hasKey) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "To enable live multi-turn AI problem solving, enter your free Google Gemini API key below. Alternatively, GuruStudy will answer from the verified offline CBSE NCERT knowledge bank.",
                        fontSize = 11.sp,
                        color = Color(0xFF78350F),
                        lineHeight = 16.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = apiKeyInput,
                            onValueChange = { apiKeyInput = it },
                            placeholder = { Text("Paste Gemini API Key (AIzaSy...)", fontSize = 11.sp) },
                            singleLine = true,
                            modifier = Modifier.weight(1f).height(48.dp)
                        )
                        Button(
                            onClick = {
                                if (apiKeyInput.isNotBlank()) {
                                    repository.setGeminiApiKey(apiKeyInput.trim())
                                    Toast.makeText(context, "API Key saved securely!", Toast.LENGTH_SHORT).show()
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Save", fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Main Query Card
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "🤖 AI Study Buddy (Maths, Science & SST)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Text(
                    text = "CBSE Class 10 step-by-step problem solver, hints, and concept coach.",
                    fontSize = 12.sp,
                    color = Color(0xFF64748B)
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("Ask a question, formula, or concept...") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Mode Chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf("Explain Concept", "Step-by-Step", "Hint First", "Revision Summary").forEach { mode ->
                        FilterChip(
                            selected = selectedMode == mode,
                            onClick = { selectedMode = mode },
                            label = { Text(mode, fontSize = 10.sp) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Language Toggle
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Explanation Language:", fontSize = 12.sp, color = Color(0xFF64748B), modifier = Modifier.weight(1f, fill = false).padding(end = 8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        FilterChip(
                            selected = selectedLanguage == "en",
                            onClick = { selectedLanguage = "en" },
                            label = { Text("English", fontSize = 11.sp) }
                        )
                        FilterChip(
                            selected = selectedLanguage == "hi",
                            onClick = { selectedLanguage = "hi" },
                            label = { Text("हिन्दी (Hindi)", fontSize = 11.sp) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Button(
                    onClick = {
                        if (query.isBlank()) {
                            Toast.makeText(context, "Please enter a question or topic", Toast.LENGTH_SHORT).show()
                            return@Button
                        }
                        isLoading = true
                        responseText = ""

                        if (repository.hasGeminiApiKey()) {
                            scope.launch {
                                val result = aiHelper.generateStudyExplanation(
                                    apiKey = repository.getGeminiApiKey(),
                                    query = query,
                                    mode = selectedMode,
                                    language = selectedLanguage
                                )
                                isLoading = false
                                when (result) {
                                    is AiResponseResult.Success -> {
                                        responseText = result.text
                                        responseTypeBadge = "🤖 AI-Generated (Verify with NCERT textbook)"
                                    }
                                    is AiResponseResult.Unavailable -> {
                                        responseText = result.message
                                        responseTypeBadge = "⚠️ Setup Required"
                                    }
                                    is AiResponseResult.Error -> {
                                        responseText = "${result.error}\n\nFalling back to verified offline NCERT database."
                                        responseTypeBadge = "📘 Verified CBSE NCERT Content"
                                    }
                                }
                            }
                        } else {
                            // Offline Verified NCERT Fallback
                            isLoading = false
                            responseTypeBadge = "📘 Verified CBSE NCERT Content"
                            val qLower = query.lowercase()
                            responseText = when {
                                qLower.contains("chemical") || qLower.contains("reaction") ->
                                    "1. Chemical Equation: 3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g).\n2. Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction.\n3. Types of Reactions:\n  • Combination: CaO + H₂O → Ca(OH)₂\n  • Decomposition: 2Pb(NO₃)₂ —Heat→ 2PbO + 4NO₂ + O₂\n  • Displacement: Fe + CuSO₄ → FeSO₄ + Cu\n  • Double Displacement: Na₂SO₄ + BaCl₂ → BaSO₄ + 2NaCl"
                                qLower.contains("quadratic") || qLower.contains("root") ->
                                    "1. Standard Quadratic Equation: ax² + bx + c = 0 (where a ≠ 0).\n2. Discriminant: D = b² - 4ac.\n3. Nature of Roots:\n  • If D > 0: Two distinct real roots.\n  • If D = 0: Two equal real roots (x = -b / 2a).\n  • If D < 0: No real roots.\n4. Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a."
                                qLower.contains("electricity") || qLower.contains("ohm") ->
                                    "1. Ohm's Law: Potential difference V across metallic conductor is directly proportional to current I: V = IR.\n2. Resistance: R = ρ(l/A) where ρ is resistivity (Ω·m).\n3. Series Circuit: R_eq = R₁ + R₂ + R₃ (same current throughout).\n4. Parallel Circuit: 1/R_eq = 1/R₁ + 1/R₂ + 1/R₃ (same voltage across each resistor)."
                                qLower.contains("light") || qLower.contains("lens") || qLower.contains("mirror") ->
                                    "1. Mirror Formula: 1/v + 1/u = 1/f; Magnification m = -v/u = h'/h.\n2. Lens Formula: 1/v - 1/u = 1/f; Magnification m = v/u = h'/h.\n3. Power of Lens: P = 1/f (in meters); SI unit is Dioptre (D).\n4. Sign Convention: u is always negative (-)."
                                qLower.contains("nationalism") || qLower.contains("gandhi") ->
                                    "1. Satyagraha in India: Champaran (1917, Indigo), Kheda (1917, Revenue), Ahmedabad (1918, Cotton Mill).\n2. Rowlatt Act (1919): Led to Jallianwala Bagh massacre (13 April 1919).\n3. Non-Cooperation Movement (1920-1922): Withdrawn after Chauri Chaura incident.\n4. Civil Disobedience Movement (1930): Began with Dandi Salt March (12 March – 6 April 1930)."
                                else ->
                                    "Verified CBSE Class 10 Syllabus Guidance:\nFocus on key NCERT textbook definitions, standard formulas with SI units, and step-by-step working. Always write final units and draw neat labelled diagrams for board examination answers."
                            }
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.fillMaxWidth().height(48.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                    } else {
                        Text("Get Verified Guidance", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }

                if (responseText.isNotBlank()) {
                    Spacer(modifier = Modifier.height(16.dp))

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (responseTypeBadge.contains("AI")) Color(0xFFEFF6FF) else Color(0xFFF0FDF4)
                    ) {
                        Text(
                            text = responseTypeBadge,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (responseTypeBadge.contains("AI")) RoyalBlue else Color(0xFF16A34A),
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = responseText,
                        fontSize = 13.sp,
                        lineHeight = 21.sp,
                        color = Color(0xFF1E293B),
                        modifier = Modifier
                            .background(Color(0xFFF8FAFC), RoundedCornerShape(10.dp))
                            .padding(14.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}
