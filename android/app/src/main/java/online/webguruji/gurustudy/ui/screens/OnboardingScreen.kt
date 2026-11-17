package online.webguruji.gurustudy.ui.screens

import android.app.DatePickerDialog
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import online.webguruji.gurustudy.data.model.UserProfile
import online.webguruji.gurustudy.ui.theme.RoyalBlue
import online.webguruji.gurustudy.ui.theme.Slate700
import online.webguruji.gurustudy.ui.theme.Slate900
import java.util.Calendar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnboardingScreen(
    onSaveProfile: (UserProfile) -> Unit
) {
    val context = LocalContext.current
    var fullName by remember { mutableStateOf("") }
    var dob by remember { mutableStateOf("2011-05-15") }
    var schoolName by remember { mutableStateOf("") }
    var preferredLang by remember { mutableStateOf("en") } // "en" or "hi"
    var hindiCourse by remember { mutableStateOf("Course A") } // "Course A" or "Course B"
    var dailyGoalMinutes by remember { mutableIntStateOf(120) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val calendar = Calendar.getInstance()
    val datePickerDialog = DatePickerDialog(
        context,
        { _, year, month, dayOfMonth ->
            dob = String.format("%04d-%02d-%02d", year, month + 1, dayOfMonth)
        },
        2011, 4, 15
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Let’s Get Into Learning!",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
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
                .verticalScroll(rememberScrollState())
                .padding(20.dp)
        ) {
            Text(
                text = "Set Up Your Student Profile",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Your name will be used by GuruStudy’s voice alarms to announce your daily study schedule.",
                fontSize = 13.sp,
                color = Slate700,
                modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
            )

            if (errorMessage != null) {
                Surface(
                    color = Color(0xFFFFE4E6),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp)
                ) {
                    Text(
                        text = errorMessage!!,
                        color = Color(0xFFDC2626),
                        fontSize = 13.sp,
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }

            // Full Name Input
            OutlinedTextField(
                value = fullName,
                onValueChange = { fullName = it },
                label = { Text("Full Name *") },
                placeholder = { Text("e.g. Rahul Sharma") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Date of Birth (DatePicker)
            OutlinedTextField(
                value = dob,
                onValueChange = {},
                readOnly = true,
                label = { Text("Date of Birth (Tap to select)") },
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { datePickerDialog.show() },
                shape = RoundedCornerShape(12.dp),
                enabled = false,
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = MaterialTheme.colorScheme.onBackground,
                    disabledBorderColor = MaterialTheme.colorScheme.outline,
                    disabledLabelColor = MaterialTheme.colorScheme.primary
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Class (Pre-selected & locked to Class 10th)
            OutlinedTextField(
                value = "Class 10th (CBSE / NCERT Session 2026–27)",
                onValueChange = {},
                readOnly = true,
                enabled = false,
                label = { Text("Class") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    disabledTextColor = MaterialTheme.colorScheme.onBackground,
                    disabledBorderColor = MaterialTheme.colorScheme.outline,
                    disabledLabelColor = MaterialTheme.colorScheme.primary
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // School Name
            OutlinedTextField(
                value = schoolName,
                onValueChange = { schoolName = it },
                label = { Text("School Name *") },
                placeholder = { Text("e.g. Kendriya Vidyalaya / DPS") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Language Selector
            Text(
                text = "Preferred Language / भाषा",
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FilterChip(
                    selected = preferredLang == "en",
                    onClick = { preferredLang = "en" },
                    label = { Text("English") },
                    modifier = Modifier.weight(1f)
                )
                FilterChip(
                    selected = preferredLang == "hi",
                    onClick = { preferredLang = "hi" },
                    label = { Text("हिंदी (Hindi)") },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Hindi Course Selection
            Text(
                text = "Hindi Course (हिंदी पाठ्यक्रम)",
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FilterChip(
                    selected = hindiCourse == "Course A",
                    onClick = { hindiCourse = "Course A" },
                    label = { Text("Course A (क्षितिज/कृतिका)") },
                    modifier = Modifier.weight(1f)
                )
                FilterChip(
                    selected = hindiCourse == "Course B",
                    onClick = { hindiCourse = "Course B" },
                    label = { Text("Course B (स्पर्श/संचयन)") },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Daily Study Goal
            Text(
                text = "Daily Study Target",
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(60 to "1 Hour", 120 to "2 Hours", 180 to "3 Hours").forEach { (mins, label) ->
                    FilterChip(
                        selected = dailyGoalMinutes == mins,
                        onClick = { dailyGoalMinutes = mins },
                        label = { Text(label) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Button(
                onClick = {
                    if (fullName.trim().isEmpty()) {
                        errorMessage = "Please enter your full name."
                        return@Button
                    }
                    if (schoolName.trim().isEmpty()) {
                        errorMessage = "Please enter your school name."
                        return@Button
                    }

                    errorMessage = null
                    val profile = UserProfile(
                        fullName = fullName.trim(),
                        dateOfBirth = dob,
                        className = "Class 10th",
                        section = "A",
                        schoolName = schoolName.trim(),
                        preferredLanguage = preferredLang,
                        dailyStudyGoalMinutes = dailyGoalMinutes,
                        hindiCourse = hindiCourse,
                        studyStreak = 0,
                        isOnboarded = true
                    )
                    onSaveProfile(profile)
                },
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = RoyalBlue),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                Text(
                    text = "Save Profile & Enter Dashboard →",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
