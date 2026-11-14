package online.webguruji.gurustudy.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import online.webguruji.gurustudy.data.model.NcertChapter
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChapterDetailScreen(
    subject: NcertSubject,
    chapter: NcertChapter,
    onBackClicked: () -> Unit,
    onStartStudyTimer: (NcertSubject, NcertChapter) -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    var currentStatus by remember { mutableStateOf(chapter.safeStatus) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Chapter ${chapter.number}: ${chapter.title}",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = subject.name,
                            fontSize = 12.sp,
                            color = Color(0xFFBAE6FD)
                        )
                    }
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
        ) {
            // Status and Action Bar
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Status: ", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                        AssistChip(
                            onClick = {
                                currentStatus = when (currentStatus) {
                                    "Not Started" -> "In Progress"
                                    "In Progress" -> "Completed"
                                    else -> "Not Started"
                                }
                                chapter.progressStatus = currentStatus
                            },
                            label = { Text(currentStatus) }
                        )
                    }

                    Button(
                        onClick = { onStartStudyTimer(subject, chapter) },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("⏱️ Study Timer", fontSize = 13.sp, color = Color.White)
                    }
                }
            }

            // Tab Row (Summary & Concepts, Formulas/Dates, Questions, MCQs)
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Summary") }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Formulas") }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text("Questions") }
                )
                Tab(
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    text = { Text("MCQs") }
                )
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
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Text(
                                    text = chapter.summary,
                                    fontSize = 14.sp,
                                    lineHeight = 22.sp
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = chapter.summaryHi,
                                    fontSize = 14.sp,
                                    lineHeight = 22.sp,
                                    color = Color(0xFF334155)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(18.dp))

                        Text(
                            text = "Key Concepts & Learning Objectives",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        chapter.keyConcepts.forEach { concept ->
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(modifier = Modifier.padding(12.dp)) {
                                    Text("📌 ", fontSize = 14.sp)
                                    Text(
                                        text = concept,
                                        fontSize = 13.sp,
                                        lineHeight = 20.sp
                                    )
                                }
                            }
                        }
                    }

                    1 -> {
                        // Formulas / Important Definitions
                        Text(
                            text = "Important Formulas & Definitions",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        if (chapter.formulas.isEmpty()) {
                            Text(
                                text = "Key definitions and concepts for this chapter are included in the Summary section.",
                                fontSize = 14.sp,
                                color = Color(0xFF64748B)
                            )
                        } else {
                            chapter.formulas.forEach { formula ->
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDF4)),
                                    shape = RoundedCornerShape(10.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(14.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text("⚡ ", fontSize = 16.sp)
                                        Text(
                                            text = formula,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = Color(0xFF15803D)
                                        )
                                    }
                                }
                            }
                        }
                    }

                    2 -> {
                        // Important Questions & Solutions
                        Text(
                            text = "NCERT High-Yield Exam Questions",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        chapter.importantQuestions.forEachIndexed { idx, q ->
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                shape = RoundedCornerShape(14.dp),
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
                                            text = "Q${idx + 1}.",
                                            fontWeight = FontWeight.Bold,
                                            color = RoyalBlue
                                        )
                                        Surface(
                                            color = Color(0xFFEFF6FF),
                                            shape = RoundedCornerShape(6.dp)
                                        ) {
                                            Text(
                                                text = "${q.marks} Marks",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.SemiBold,
                                                color = RoyalBlue,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = q.question,
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 14.sp
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = q.questionHi,
                                        fontSize = 13.sp,
                                        color = Color(0xFF475569)
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Surface(
                                        color = Color(0xFFF8FAFC),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Column(modifier = Modifier.padding(10.dp)) {
                                            Text(
                                                text = "Solution:",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = Color(0xFF16A34A)
                                            )
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = q.solution,
                                                fontSize = 13.sp,
                                                lineHeight = 20.sp
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    3 -> {
                        // MCQs with Interactive Option Selection & Explanation
                        Text(
                            text = "Practice MCQs (CBSE Pattern)",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        chapter.mcqs.forEachIndexed { qIdx, mcq ->
                            var selectedOption by remember { mutableStateOf<Int?>(null) }

                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 6.dp)
                            ) {
                                Column(modifier = Modifier.padding(14.dp)) {
                                    Text(
                                        text = "Q${qIdx + 1}. ${mcq.question}",
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 14.sp
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))

                                    mcq.options.forEachIndexed { optIdx, optText ->
                                        val isSelected = selectedOption == optIdx
                                        val isCorrect = optIdx == mcq.correctIndex
                                        val btnColor = when {
                                            selectedOption == null -> MaterialTheme.colorScheme.surface
                                            isSelected && isCorrect -> Color(0xFFDCFCE7)
                                            isSelected && !isCorrect -> Color(0xFFFFE4E6)
                                            optIdx == mcq.correctIndex -> Color(0xFFDCFCE7)
                                            else -> MaterialTheme.colorScheme.surface
                                        }

                                        Surface(
                                            onClick = { if (selectedOption == null) selectedOption = optIdx },
                                            shape = RoundedCornerShape(8.dp),
                                            color = btnColor,
                                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFCBD5E1)),
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(vertical = 3.dp)
                                        ) {
                                            Text(
                                                text = "${('A' + optIdx)}. $optText",
                                                fontSize = 13.sp,
                                                modifier = Modifier.padding(10.dp)
                                            )
                                        }
                                    }

                                    if (selectedOption != null) {
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Surface(
                                            color = Color(0xFFF1F5F9),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            Text(
                                                text = "💡 Explanation: ${mcq.explanation}",
                                                fontSize = 12.sp,
                                                color = Color(0xFF334155),
                                                modifier = Modifier.padding(8.dp)
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
    }
}
