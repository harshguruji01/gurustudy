package online.webguruji.gurustudy.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BooksScreen(
    subjects: List<NcertSubject>,
    onChapterSelected: (NcertSubject, NcertChapter) -> Unit
) {
    var selectedSubjectId by remember { mutableStateOf(subjects.firstOrNull()?.id ?: "maths") }
    var searchQuery by remember { mutableStateOf("") }
    var selectedStatusFilter by remember { mutableStateOf("All") } // "All", "Not Started", "In Progress", "Completed"

    val currentSubject = subjects.find { it.id == selectedSubjectId } ?: subjects.firstOrNull()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(top = 16.dp)
    ) {
        // Screen Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "📚 NCERT Books & Notes",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Class 10 CBSE 2026–2027 Complete Syllabus",
                    fontSize = 13.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(top = 2.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search any chapter, formula or topic...", fontSize = 13.sp) },
            leadingIcon = { Text("🔍", fontSize = 14.sp) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Text("✕", fontSize = 14.sp, color = Color(0xFF64748B))
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = RoyalBlue,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f),
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Subject Horizontal Selector Chips
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(subjects) { subject ->
                val isSelected = subject.id == selectedSubjectId && searchQuery.isEmpty()
                FilterChip(
                    selected = isSelected,
                    onClick = {
                        selectedSubjectId = subject.id
                        searchQuery = ""
                    },
                    label = {
                        Text(
                            text = "${subject.icon} ${subject.name}",
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                        )
                    },
                    shape = RoundedCornerShape(20.dp),
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = RoyalBlue,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Status Filter Chips
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            val filters = listOf("All", "Not Started", "In Progress", "Completed")
            items(filters) { filter ->
                val isSelected = selectedStatusFilter == filter
                SuggestionChip(
                    onClick = { selectedStatusFilter = filter },
                    label = {
                        Text(
                            text = filter,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            color = if (isSelected) RoyalBlue else MaterialTheme.colorScheme.onSurface
                        )
                    },
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(
                        width = if (isSelected) 1.5.dp else 1.dp,
                        color = if (isSelected) RoyalBlue else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Books and Chapters Content
        if (searchQuery.isNotEmpty()) {
            // Global Search Results across all subjects
            val searchResults = remember(searchQuery, subjects) {
                val q = searchQuery.trim().lowercase()
                val list = mutableListOf<Pair<NcertSubject, NcertChapter>>()
                subjects.forEach { subj ->
                    subj.books.forEach { book ->
                        book.chapters.forEach { ch ->
                            if (ch.title.lowercase().contains(q) ||
                                ch.titleHi.lowercase().contains(q) ||
                                ch.summary.lowercase().contains(q) ||
                                ch.keyConcepts.any { it.lowercase().contains(q) } ||
                                ch.formulas.any { it.lowercase().contains(q) }
                            ) {
                                list.add(Pair(subj, ch))
                            }
                        }
                    }
                }
                list
            }

            if (searchResults.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🔍", fontSize = 40.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No chapters matching '$searchQuery'",
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "Try searching by topic, subject name, or formula name.",
                            fontSize = 12.sp,
                            color = Color(0xFF64748B),
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(searchResults) { (subj, chapter) ->
                        ChapterCard(
                            subject = subj,
                            chapter = chapter,
                            onClick = { onChapterSelected(subj, chapter) }
                        )
                    }
                }
            }
        } else if (currentSubject != null) {
            LazyColumn(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(currentSubject.books) { book ->
                    // Book Title Header
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = RoyalBlue.copy(alpha = 0.12f),
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Text(
                                text = "NCERT",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = RoyalBlue,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        Text(
                            text = book.title,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    }

                    val filteredChapters = book.chapters.filter { ch ->
                        val status = ch.safeStatus
                        when (selectedStatusFilter) {
                            "All" -> true
                            "Not Started" -> status == "Not Started"
                            "In Progress" -> status == "In Progress"
                            "Completed" -> status == "Completed"
                            else -> true
                        }
                    }

                    if (filteredChapters.isEmpty()) {
                        Text(
                            text = "No chapters under '$selectedStatusFilter'",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8),
                            modifier = Modifier.padding(vertical = 8.dp, horizontal = 12.dp)
                        )
                    } else {
                        filteredChapters.forEach { chapter ->
                            ChapterCard(
                                subject = currentSubject,
                                chapter = chapter,
                                onClick = { onChapterSelected(currentSubject, chapter) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                }
            }
        }
    }
}

@Composable
fun ChapterCard(
    subject: NcertSubject,
    chapter: NcertChapter,
    onClick: () -> Unit
) {
    val safeStatus = chapter.safeStatus
    val badgeBg = when (safeStatus) {
        "Completed" -> Color(0xFFDCFCE7)
        "In Progress" -> Color(0xFFFEF3C7)
        else -> Color(0xFFF1F5F9)
    }
    val badgeColor = when (safeStatus) {
        "Completed" -> Color(0xFF16A34A)
        "In Progress" -> Color(0xFFD97706)
        else -> Color(0xFF64748B)
    }

    Card(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Chapter Number Circle
            Surface(
                shape = CircleShape,
                color = RoyalBlue.copy(alpha = 0.1f),
                modifier = Modifier.size(42.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = chapter.number.toString(),
                        color = RoyalBlue,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(14.dp))

            // Title & Meta
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = chapter.title.ifBlank { "Chapter ${chapter.number}" },
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                if (chapter.titleHi.isNotBlank()) {
                    Text(
                        text = chapter.titleHi,
                        fontSize = 12.sp,
                        color = Color(0xFF64748B),
                        modifier = Modifier.padding(top = 1.dp)
                    )
                }

                // Quick Content Counts
                Row(
                    modifier = Modifier.padding(top = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (chapter.formulas.isNotEmpty()) {
                        Text(
                            text = "⚡ ${chapter.formulas.size} formulas",
                            fontSize = 11.sp,
                            color = RoyalBlue,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    if (chapter.importantQuestions.isNotEmpty()) {
                        Text(
                            text = "📝 ${chapter.importantQuestions.size} Q&A",
                            fontSize = 11.sp,
                            color = Color(0xFF475569)
                        )
                    }
                    if (chapter.mcqs.isNotEmpty()) {
                        Text(
                            text = "🎯 ${chapter.mcqs.size} MCQs",
                            fontSize = 11.sp,
                            color = EmeraldGreen,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Progress Badge
            Surface(
                shape = RoundedCornerShape(6.dp),
                color = badgeBg
            ) {
                Text(
                    text = safeStatus,
                    color = badgeColor,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }
    }
}
