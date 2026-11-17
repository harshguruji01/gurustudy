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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import online.webguruji.gurustudy.data.model.NcertChapter
import online.webguruji.gurustudy.data.model.NcertSubject
import online.webguruji.gurustudy.data.repository.StudyRepository
import online.webguruji.gurustudy.ui.theme.EmeraldGreen
import online.webguruji.gurustudy.ui.theme.RoyalBlue

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun BooksScreen(
    subjects: List<NcertSubject>,
    onChapterSelected: (NcertSubject, NcertChapter) -> Unit
) {
    val context = LocalContext.current
    val repository = remember { StudyRepository(context) }

    var selectedSubjectId by remember { mutableStateOf(subjects.firstOrNull()?.id ?: "maths") }
    var searchQuery by remember { mutableStateOf("") }
    var selectedStatusFilter by remember { mutableStateOf("All") } // "All", "Not Started", "In Progress", "Completed", "Bookmarked"

    val lastReadSubj = repository.getLastReadSubject()
    val lastReadCh = repository.getLastReadChapter()

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
                    text = "📚 NCERT Digital Library",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Class 10 CBSE 2026–2027 • 100% Offline Verified Curriculum",
                    fontSize = 12.sp,
                    color = Color(0xFF64748B),
                    modifier = Modifier.padding(top = 2.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Continue Reading Hero Card
        if (lastReadCh.isNotBlank()) {
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier.weight(1f).padding(end = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFFDBEAFE),
                            modifier = Modifier.size(44.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text("📖", fontSize = 20.sp)
                            }
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Continue Reading",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = RoyalBlue
                            )
                            Text(
                                text = lastReadCh,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface,
                                softWrap = true
                            )
                            Text(
                                text = "$lastReadSubj • NCERT Class 10",
                                fontSize = 11.sp,
                                color = Color(0xFF64748B)
                            )
                        }
                    }

                    Button(
                        onClick = {
                            val matchedSubj = subjects.find { it.name.equals(lastReadSubj, ignoreCase = true) } ?: subjects.firstOrNull()
                            if (matchedSubj != null) {
                                val matchedCh = matchedSubj.books.flatMap { it.chapters }.find { it.title.equals(lastReadCh, ignoreCase = true) }
                                    ?: matchedSubj.books.firstOrNull()?.chapters?.firstOrNull()
                                if (matchedCh != null) {
                                    onChapterSelected(matchedSubj, matchedCh)
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Text("Resume", fontSize = 12.sp, color = Color.White, maxLines = 1, softWrap = false)
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search any chapter, formula, or concept...", fontSize = 13.sp) },
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
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            fontSize = 12.sp
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
            val filters = listOf("All", "Not Started", "In Progress", "Completed", "Bookmarked")
            items(filters) { filter ->
                val isSelected = selectedStatusFilter == filter
                SuggestionChip(
                    onClick = { selectedStatusFilter = filter },
                    label = {
                        Text(
                            text = if (filter == "Bookmarked") "⭐ Bookmarked" else filter,
                            fontSize = 11.sp,
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

        Spacer(modifier = Modifier.height(8.dp))

        // Filter chapters based on search query, subject, and status
        val filteredList = remember(searchQuery, selectedSubjectId, selectedStatusFilter, subjects) {
            if (searchQuery.isNotEmpty()) {
                val q = searchQuery.lowercase()
                subjects.flatMap { subj ->
                    subj.books.flatMap { book ->
                        book.chapters.filter { ch ->
                            ch.title.lowercase().contains(q) ||
                            ch.summary.lowercase().contains(q) ||
                            ch.keyConcepts.any { it.lowercase().contains(q) } ||
                            ch.formulas.any { it.lowercase().contains(q) }
                        }.map { Pair(subj, it) }
                    }
                }
            } else {
                val subj = currentSubject
                if (subj != null) {
                    subj.books.flatMap { book ->
                        book.chapters.filter { ch ->
                            when (selectedStatusFilter) {
                                "Bookmarked" -> ch.isBookmarked
                                "Not Started" -> ch.safeStatus == "Not Started"
                                "In Progress" -> ch.safeStatus == "In Progress"
                                "Completed" -> ch.safeStatus == "Completed"
                                else -> true
                            }
                        }.map { Pair(subj, it) }
                    }
                } else emptyList()
            }
        }

        if (filteredList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🔍", fontSize = 40.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = if (selectedStatusFilter == "Bookmarked") "No bookmarked chapters yet!" else "No chapters matched your search filter.",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = if (selectedStatusFilter == "Bookmarked") "Tap the star icon on any chapter to bookmark it for quick access." else "Try searching for a different keyword or select 'All'.",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B),
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
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
                items(filteredList) { (subj, chapter) ->
                    Card(
                        onClick = { onChapterSelected(subj, chapter) },
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Chapter Number Box
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (chapter.safeStatus == "Completed") Color(0xFFDCFCE7) else Color(0xFFEFF6FF),
                                modifier = Modifier.size(52.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = "${chapter.number}",
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (chapter.safeStatus == "Completed") Color(0xFF16A34A) else RoyalBlue
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(14.dp))

                            // Details
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = chapter.title,
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        modifier = Modifier.weight(1f, fill = false)
                                    )
                                    if (chapter.isBookmarked) {
                                        Text(" ⭐", fontSize = 12.sp)
                                    }
                                }

                                if (chapter.titleHi.isNotBlank()) {
                                    Text(
                                        text = chapter.titleHi,
                                        fontSize = 12.sp,
                                        color = Color(0xFF64748B),
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(6.dp))

                                FlowRow(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = when (chapter.safeStatus) {
                                            "Completed" -> Color(0xFFDCFCE7)
                                            "In Progress" -> Color(0xFFEFF6FF)
                                            else -> Color(0xFFF1F5F9)
                                        }
                                    ) {
                                        Text(
                                            text = chapter.safeStatus,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = when (chapter.safeStatus) {
                                                "Completed" -> Color(0xFF16A34A)
                                                "In Progress" -> RoyalBlue
                                                else -> Color(0xFF64748B)
                                            },
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            maxLines = 1,
                                            softWrap = false
                                        )
                                    }

                                    Text(
                                        text = "• ${chapter.keyConcepts.size} concepts • ${chapter.mcqs.size} MCQs",
                                        fontSize = 11.sp,
                                        color = Color(0xFF94A3B8),
                                        maxLines = 1,
                                        softWrap = false
                                    )
                                }
                            }

                            Text("›", fontSize = 24.sp, color = Color(0xFF94A3B8))
                        }
                    }
                }
            }
        }
    }
}
