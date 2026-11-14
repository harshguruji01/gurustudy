package online.webguruji.gurustudy.data.model

data class NcertSubject(
    val id: String,
    val name: String,
    val nameHi: String,
    val code: String,
    val icon: String,
    val color: String,
    val books: List<NcertBook>
)

data class NcertBook(
    val id: String,
    val title: String,
    val titleHi: String,
    val chapters: List<NcertChapter>
)

data class NcertChapter(
    val number: Int = 1,
    val title: String = "",
    val titleHi: String = "",
    val summary: String = "",
    val summaryHi: String = "",
    val keyConcepts: List<String> = emptyList(),
    val formulas: List<String> = emptyList(),
    val importantQuestions: List<ImportantQuestion> = emptyList(),
    val mcqs: List<McqQuestion> = emptyList(),
    var progressStatus: String? = "Not Started", // "Not Started", "In Progress", "Completed", "Needs Revision"
    var isBookmarked: Boolean = false
) {
    val safeStatus: String
        get() = if (progressStatus.isNullOrBlank()) "Not Started" else progressStatus!!
}

data class ImportantQuestion(
    val question: String,
    val questionHi: String,
    val solution: String,
    val marks: Int
)

data class McqQuestion(
    val question: String,
    val options: List<String>,
    val correctIndex: Int,
    val explanation: String
)

data class MistakeItem(
    val id: String,
    val subjectName: String,
    val chapterTitle: String,
    val questionText: String,
    val selectedWrongAnswer: String,
    val correctAnswer: String,
    val explanation: String,
    val dateAdded: String
)
