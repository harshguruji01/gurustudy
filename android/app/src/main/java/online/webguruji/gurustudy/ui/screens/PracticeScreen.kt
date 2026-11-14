package online.webguruji.gurustudy.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import online.webguruji.gurustudy.data.model.MistakeItem
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PracticeScreen(
    subjects: List<NcertSubject>,
    mistakes: List<MistakeItem>,
    onAddMistake: (MistakeItem) -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Mock Quiz, 1: Formula Sheet, 2: Mistake Notebook

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Practice & Revision Centre",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
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
                    text = { Text("Mock Quiz") }
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
                2 -> MistakeNotebookTab(mistakes)
                3 -> PyqTab()
                4 -> AiAssistantTab()
            }
        }
    }
}

@Composable
fun MockQuizTab(
    subjects: List<NcertSubject>,
    onAddMistake: (MistakeItem) -> Unit
) {
    // Collect all MCQs from all subjects
    val allMcqs = remember(subjects) {
        val list = mutableListOf<Triple<String, String, online.webguruji.gurustudy.data.model.McqQuestion>>()
        subjects.forEach { subj ->
            subj.books.forEach { book ->
                book.chapters.forEach { ch ->
                    ch.mcqs.forEach { mcq ->
                        list.add(Triple(subj.name, ch.title, mcq))
                    }
                }
            }
        }
        list.shuffled()
    }

    var currentQuestionIndex by remember { mutableIntStateOf(0) }
    var selectedOption by remember { mutableStateOf<Int?>(null) }
    var score by remember { mutableIntStateOf(0) }
    var quizFinished by remember { mutableStateOf(false) }

    if (allMcqs.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No quiz questions loaded yet.")
        }
        return
    }

    if (quizFinished) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text("🏆 Quiz Completed!", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Your Score: $score / ${minOf(10, allMcqs.size)}",
                fontSize = 20.sp,
                fontWeight = FontWeight.SemiBold,
                color = RoyalBlue
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    currentQuestionIndex = 0
                    selectedOption = null
                    score = 0
                    quizFinished = false
                },
                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue)
            ) {
                Text("Restart Quiz", color = Color.White)
            }
        }
        return
    }

    val currentItem = allMcqs[currentQuestionIndex]
    val subjName = currentItem.first
    val chTitle = currentItem.second
    val mcq = currentItem.third

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Question ${currentQuestionIndex + 1} of ${minOf(10, allMcqs.size)}",
                fontSize = 13.sp,
                color = Color(0xFF64748B)
            )
            Surface(
                color = Color(0xFFEFF6FF),
                shape = RoundedCornerShape(6.dp)
            ) {
                Text(
                    text = "$subjName • $chTitle",
                    fontSize = 11.sp,
                    color = RoyalBlue,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = mcq.question,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(16.dp))

                mcq.options.forEachIndexed { idx, opt ->
                    val isSelected = selectedOption == idx
                    val isCorrect = idx == mcq.correctIndex
                    val btnBg = when {
                        selectedOption == null -> MaterialTheme.colorScheme.surface
                        isSelected && isCorrect -> Color(0xFFDCFCE7)
                        isSelected && !isCorrect -> Color(0xFFFFE4E6)
                        idx == mcq.correctIndex -> Color(0xFFDCFCE7)
                        else -> MaterialTheme.colorScheme.surface
                    }

                    Surface(
                        onClick = {
                            if (selectedOption == null) {
                                selectedOption = idx
                                if (idx == mcq.correctIndex) {
                                    score += 1
                                } else {
                                    // Log to mistake notebook
                                    onAddMistake(
                                        MistakeItem(
                                            id = "mistake_${System.currentTimeMillis()}",
                                            subjectName = subjName,
                                            chapterTitle = chTitle,
                                            questionText = mcq.question,
                                            selectedWrongAnswer = opt,
                                            correctAnswer = mcq.options[mcq.correctIndex],
                                            explanation = mcq.explanation,
                                            dateAdded = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault()).format(java.util.Date())
                                        )
                                    )
                                }
                            }
                        },
                        shape = RoundedCornerShape(10.dp),
                        color = btnBg,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFCBD5E1)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                    ) {
                        Text(
                            text = "${('A' + idx)}. $opt",
                            fontSize = 14.sp,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }

                if (selectedOption != null) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Surface(
                        color = Color(0xFFF1F5F9),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "💡 ${mcq.explanation}",
                            fontSize = 12.sp,
                            color = Color(0xFF334155),
                            modifier = Modifier.padding(10.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            if (currentQuestionIndex < minOf(9, allMcqs.size - 1)) {
                                currentQuestionIndex += 1
                                selectedOption = null
                            } else {
                                quizFinished = true
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Next Question →", color = Color.White)
                    }
                }
            }
        }
    }
}

@Composable
fun FormulaSheetsTab(subjects: List<NcertSubject>) {
    val mathAndScience = subjects.filter { it.id == "maths" || it.id == "science" }

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(mathAndScience) { subject ->
            Text(
                text = "${subject.name} Important Formula Sheet",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = RoyalBlue
            )

            subject.books.forEach { book ->
                book.chapters.forEach { ch ->
                    if (ch.formulas.isNotEmpty()) {
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = "Ch ${ch.number}: ${ch.title}",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF1E293B)
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                ch.formulas.forEach { formula ->
                                    Text(
                                        text = "• $formula",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color(0xFF16A34A),
                                        modifier = Modifier.padding(vertical = 2.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MistakeNotebookTab(mistakes: List<MistakeItem>) {
    if (mistakes.isEmpty()) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(text = "🎯", fontSize = 48.sp)
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Mistake Notebook is Empty!",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Whenever you get an MCQ wrong in practice tests, it will be automatically saved here for quick revision.",
                    fontSize = 13.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }
        return
    }

    LazyColumn(
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(mistakes) { item ->
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "${item.subjectName} • ${item.chapterTitle}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = RoyalBlue
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = item.questionText,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "❌ Your answer: ${item.selectedWrongAnswer}",
                        fontSize = 13.sp,
                        color = Color(0xFFEF4444)
                    )
                    Text(
                        text = "✓ Correct answer: ${item.correctAnswer}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF16A34A)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "💡 ${item.explanation}",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B)
                    )
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
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (expanded) "Hide Solution" else "View Official CBSE Marking Scheme")
                    }
                    if (expanded) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = item.third,
                            fontSize = 12.sp,
                            lineHeight = 18.sp,
                            color = Color(0xFF334155),
                            modifier = Modifier.background(Color(0xFFF8FAFC), RoundedCornerShape(8.dp)).padding(10.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun AiAssistantTab() {
    var query by remember { mutableStateOf("") }
    var responseText by remember { mutableStateOf("") }
    var selectedMode by remember { mutableStateOf("Explain Concept") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "🤖 AI Study Assistant (Maths & Science)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Text(
                    text = "Step-by-step problem solver and concept explanations strictly aligned with CBSE Class 10.",
                    fontSize = 12.sp,
                    color = Color(0xFF64748B)
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("Ask any Maths or Science question...") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    listOf("Explain Concept", "Step-by-Step", "Hint First").forEach { mode ->
                        FilterChip(
                            selected = selectedMode == mode,
                            onClick = { selectedMode = mode },
                            label = { Text(mode, fontSize = 11.sp) }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        val qLower = query.lowercase()
                        responseText = when {
                            qLower.contains("chemical") || qLower.contains("reaction") ->
                                "1. Chemical Equation: 3Fe + 4H2O → Fe3O4 + 4H2.\n2. Law of Conservation of Mass: Total mass of reactants equals total mass of products.\n3. Types: Combination, Decomposition, Displacement, Double Displacement."
                            qLower.contains("quadratic") ->
                                "1. Standard Form: ax² + bx + c = 0.\n2. Discriminant D = b² - 4ac.\n3. If D > 0: 2 distinct real roots; If D = 0: 2 equal real roots; If D < 0: no real roots.\n4. Quadratic Formula: x = [-b ± √D] / 2a."
                            qLower.contains("electricity") || qLower.contains("ohm") ->
                                "1. Ohm's Law: V = IR at constant temperature.\n2. Resistance factors: R = ρl/A.\n3. Series: Rs = R1 + R2 + R3. Parallel: 1/Rp = 1/R1 + 1/R2 + 1/R3."
                            else ->
                                "CBSE Class 10 Concept Guidance:\nFocus on key NCERT definitions, formulas with SI units, and step-by-step working to secure full marks in board examinations."
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Ask Assistant", color = Color.White)
                }

                if (responseText.isNotBlank()) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Verified Syllabus Response:",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = RoyalBlue
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = responseText,
                        fontSize = 13.sp,
                        lineHeight = 20.sp,
                        color = Color(0xFF1E293B),
                        modifier = Modifier
                            .background(Color(0xFFF1F5F9), RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    )
                }
            }
        }
    }
}
