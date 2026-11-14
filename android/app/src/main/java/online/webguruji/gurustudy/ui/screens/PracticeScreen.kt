package online.webguruji.gurustudy.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface
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
                    text = { Text("Mistake Book (${mistakes.size})") }
                )
            }

            when (selectedTab) {
                0 -> MockQuizTab(subjects, onAddMistake)
                1 -> FormulaSheetsTab(subjects)
                2 -> MistakeNotebookTab(mistakes)
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
