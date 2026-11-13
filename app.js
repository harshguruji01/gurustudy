// GuruStudy Web Application Logic
// Developed by HarshGuruJi (contact@webguruji.online)

const TRANSLATIONS = {
  en: {
    tagline: "NCERT Class 10 • Session 2026–27",
    greeting: "Namaste, %s! 🙏",
    heroSub: "Session 2026–2027 • CBSE Class 10th",
    roadmapTitle: "93-Day Syllabus Roadmap (15 Nov 2026 – 15 Feb 2027)",
    completedDays: "✅ Completed: %d days",
    remainingDays: "⏳ Remaining: %d days",
    quickAccess: "Quick Access",
    qaBooks: "NCERT Books",
    qaBooksSub: "All 6 Subjects",
    qaCal: "Study Calendar",
    qaCalSub: "93-Day Roadmap",
    qaQuiz: "Practice & Quiz",
    qaQuizSub: "MCQs & Formulas",
    qaTimer: "Focus Timer",
    qaTimerSub: "Deep Study Mode",
    navHome: "Home",
    navBooks: "Books",
    navCal: "Calendar",
    navPractice: "Practice",
    navProfile: "Profile",
    calHeading: "My Study Calendar 2026–27",
    calSub: "93-Day Board Exam Preparation (15 Nov 2026 – 15 Feb 2027)",
    booksHeading: "My NCERT Books",
    booksSub: "Class 10 CBSE 2026–2027 Official Curriculum",
    practiceHeading: "Practice & Revision Centre",
    practiceSub: "MCQ Mock Tests, Formula Sheets & Mistake Notebook"
  },
  hi: {
    tagline: "एनसीईआरटी कक्षा 10 • सत्र 2026–27",
    greeting: "नमस्ते, %s! 🙏",
    heroSub: "सत्र 2026–2027 • सीबीएसई कक्षा 10वीं",
    roadmapTitle: "93-दिवसीय पाठ्यक्रम योजना (15 नवंबर 2026 – 15 फरवरी 2027)",
    completedDays: "✅ पूर्ण: %d दिन",
    remainingDays: "⏳ शेष: %d दिन",
    quickAccess: "त्वरित मेन्यू",
    qaBooks: "एनसीईआरटी किताबें",
    qaBooksSub: "सभी 6 विषय",
    qaCal: "अध्ययन कैलेंडर",
    qaCalSub: "93-दिवसीय योजना",
    qaQuiz: "अभ्यास एवं क्विज",
    qaQuizSub: "MCQ एवं सूत्र",
    qaTimer: "फोकस टाइमर",
    qaTimerSub: "गहन अध्ययन मोड",
    navHome: "होम",
    navBooks: "किताबें",
    navCal: "कैलेंडर",
    navPractice: "अभ्यास",
    navProfile: "प्रोफाइल",
    calHeading: "मेरा अध्ययन कैलेंडर 2026–27",
    calSub: "93-दिवसीय बोर्ड परीक्षा तैयारी (15 नवंबर 2026 – 15 फरवरी 2027)",
    booksHeading: "मेरी एनसीईआरटी पुस्तकें",
    booksSub: "कक्षा 10 सीबीएसई 2026–2027 आधिकारिक पाठ्यक्रम",
    practiceHeading: "अभ्यास एवं पुनरावृत्ति केंद्र",
    practiceSub: "MCQ मॉक टेस्ट, सूत्र पट्टिका एवं मिस्टेक नोटबुक"
  }
};

// Global App State
const AppState = {
  userProfile: null,
  schedules: [],
  subjects: typeof NCERT_DATA !== "undefined" ? NCERT_DATA : [],
  mistakes: [],
  currentTab: "home",
  currentLang: "en",
  theme: "light",
  currentMonthFilter: "All",
  activeTimer: {
    subject: "Mathematics",
    chapter: "Real Numbers",
    totalSeconds: 2700,
    remainingSeconds: 2700,
    intervalId: null,
    isRunning: false
  },
  editingDayIndex: null,
  activeChapterData: null,
  activeAudioContext: null
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  applyTheme(AppState.theme);
  applyTranslations();

  if (!AppState.userProfile || !AppState.userProfile.fullName) {
    AppState.userProfile = {
      fullName: "Rahul Sharma",
      schoolName: "CBSE Class 10th",
      preferredLanguage: "en",
      hindiCourse: "Course A",
      dailyGoalMinutes: 240,
      studyStreak: 1
    };
  }
  renderAllViews();

  setupEventListeners();
});

// Load Data from LocalStorage or Default Assets
function loadStoredData() {
  const storedProfile = localStorage.getItem("gurustudy_profile");
  if (storedProfile) {
    AppState.userProfile = JSON.parse(storedProfile);
    AppState.currentLang = AppState.userProfile.preferredLanguage || "en";
  }

  const storedSchedules = localStorage.getItem("gurustudy_schedules");
  if (storedSchedules) {
    AppState.schedules = JSON.parse(storedSchedules);
  } else if (typeof ROADMAP_DATA !== "undefined") {
    AppState.schedules = JSON.parse(JSON.stringify(ROADMAP_DATA));
    saveSchedulesToStorage();
  }

  const storedMistakes = localStorage.getItem("gurustudy_mistakes");
  if (storedMistakes) {
    AppState.mistakes = JSON.parse(storedMistakes);
  }

  const storedTheme = localStorage.getItem("gurustudy_theme");
  if (storedTheme) {
    AppState.theme = storedTheme;
  }
}

function saveProfileToStorage() {
  localStorage.setItem("gurustudy_profile", JSON.stringify(AppState.userProfile));
}

function saveSchedulesToStorage() {
  localStorage.setItem("gurustudy_schedules", JSON.stringify(AppState.schedules));
}

function saveMistakesToStorage() {
  localStorage.setItem("gurustudy_mistakes", JSON.stringify(AppState.mistakes));
}

// Event Listeners Setup
function setupEventListeners() {
  document.getElementById("btnToggleTheme")?.addEventListener("click", toggleTheme);
  document.getElementById("btnToggleLang")?.addEventListener("click", toggleLanguage);

  document.getElementById("btnStartTodayStudy")?.addEventListener("click", () => {
    const today = getTodaySchedule();
    if (today) {
      openTimerModal(today.subject, today.chapterTitle, today.estimatedMinutes);
    }
  });

  document.getElementById("btnTestAlarmNow")?.addEventListener("click", () => {
    const today = getTodaySchedule();
    const subj = today ? today.subject : "Science";
    const ch = today ? today.chapterTitle : "Electricity";
    triggerAlarmModal(subj, ch, 45);
  });
}

// Navigation Tab Switcher
function switchTab(tabId) {
  AppState.currentTab = tabId;
  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
  document.getElementById(`tab-${tabId}`)?.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  const navIndices = { home: 0, books: 1, calendar: 2, practice: 3, profile: 4 };
  const navItems = document.querySelectorAll(".nav-item");
  if (navItems[navIndices[tabId]]) {
    navItems[navIndices[tabId]].classList.add("active");
  }

  const plannerSection = document.getElementById("interactive-planner");
  if (plannerSection && window.scrollY > plannerSection.offsetTop + 100) {
    plannerSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Theme Management
function toggleTheme() {
  AppState.theme = AppState.theme === "dark" ? "light" : "dark";
  applyTheme(AppState.theme);
  localStorage.setItem("gurustudy_theme", AppState.theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("btnToggleTheme");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

// Language Translation Management
function toggleLanguage() {
  const nextLang = AppState.currentLang === "en" ? "hi" : "en";
  setLanguage(nextLang);
}

function setLanguage(lang) {
  AppState.currentLang = lang;
  if (AppState.userProfile) {
    AppState.userProfile.preferredLanguage = lang;
    saveProfileToStorage();
  }
  applyTranslations();
  renderAllViews();
}

function applyTranslations() {
  const t = TRANSLATIONS[AppState.currentLang] || TRANSLATIONS.en;
  const name = AppState.userProfile ? AppState.userProfile.fullName : "Student";

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("headerTagline", t.tagline);
  setText("heroGreetingText", t.greeting.replace("%s", name));
  setText("heroDateText", t.heroSub);
  setText("txtRoadmapTitle", t.roadmapTitle);
  setText("txtQuickAccess", t.quickAccess);
  setText("qaBooksTitle", t.qaBooks);
  setText("qaBooksSub", t.qaBooksSub);
  setText("qaCalTitle", t.qaCal);
  setText("qaCalSub", t.qaCalSub);
  setText("qaQuizTitle", t.qaQuiz);
  setText("qaQuizSub", t.qaQuizSub);
  setText("qaTimerTitle", t.qaTimer);
  setText("qaTimerSub", t.qaTimerSub);
  setText("navTextHome", t.navHome);
  setText("navTextBooks", t.navBooks);
  setText("navTextCal", t.navCal);
  setText("navTextPractice", t.navPractice);
  setText("navTextProfile", t.navProfile);
  setText("calHeading", t.calHeading);
  setText("calSubheading", t.calSub);
  setText("booksHeading", t.booksHeading);
  setText("booksSubheading", t.booksSub);
  setText("practiceHeading", t.practiceHeading);
  setText("practiceSubheading", t.practiceSub);
  setText("currentLangLabel", AppState.currentLang === "hi" ? "हिंदी (Hindi)" : "English");
}

function setHindiCourse(course) {
  if (AppState.userProfile) {
    AppState.userProfile.hindiCourse = course;
    saveProfileToStorage();
    document.getElementById("currentHindiCourseLabel").textContent = course;
    renderBooksTab();
  }
}

// Render All Views
function renderAllViews() {
  renderHomeTab();
  renderBooksTab();
  renderCalendarTab();
  renderPracticeTab();
  renderProfileTab();
}

// TAB 1: RENDER HOME
function renderHomeTab() {
  if (!AppState.userProfile) return;

  const completed = AppState.schedules.filter(s => s.status === "Completed").length;
  const total = AppState.schedules.length || 93;
  const pct = Math.round((completed / total) * 100);

  document.getElementById("txtRoadmapPct").textContent = `${pct}%`;
  document.getElementById("roadmapProgressBar").style.width = `${pct}%`;
  document.getElementById("txtCompletedDays").textContent = `✅ Completed: ${completed} days`;
  document.getElementById("txtRemainingDays").textContent = `⏳ Remaining: ${total - completed} days`;
  document.getElementById("headerStreakText").textContent = `${AppState.userProfile.studyStreak || 1} Days`;

  const today = getTodaySchedule();
  if (today) {
    document.getElementById("todayStatusBadge").textContent = today.status;
    document.getElementById("todayStatusBadge").className = `status-pill ${today.status === "Completed" ? "done" : "pending"}`;
    const phaseEl = document.getElementById("todayPhaseText");
    if (phaseEl) {
      phaseEl.textContent = `${today.phase || "Phase 1: Foundation Building"} • Day ${today.dayIndex} (${today.dayOfWeek})`;
    }

    const sundayNotice = document.getElementById("sundayBufferNotice");
    if (sundayNotice) {
      sundayNotice.style.display = today.isSunday ? "block" : "none";
    }

    const container = document.getElementById("todaySlotsContainer");
    if (container) {
      container.innerHTML = "";
      const slots = today.slots || [
        { subject: "Mathematics", topic: today.chapterTitle, durationMinutes: 90, scheduledTime: "06:00", alarmEnabled: true },
        { subject: "Science", topic: today.topic, durationMinutes: 60, scheduledTime: "17:30", alarmEnabled: true },
        { subject: "Social Science", topic: "Nationalism & Resources", durationMinutes: 60, scheduledTime: "19:00", alarmEnabled: true },
        { subject: "English", topic: "First Flight & Grammar", durationMinutes: 30, scheduledTime: "20:30", alarmEnabled: true }
      ];

      slots.forEach(slot => {
        const slotEl = document.createElement("div");
        slotEl.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 14px; gap: 10px;";
        const safeTopic = (slot.topic || "").replace(/'/g, "\\'");
        slotEl.innerHTML = `
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 13px; font-weight: 800; color: var(--primary);">${slot.subject}</span>
              <span style="font-size: 11px; background: var(--primary-subtle); color: var(--primary); padding: 1px 6px; border-radius: 4px; font-weight: 700;">⏱️ ${slot.durationMinutes}m</span>
              <span style="font-size: 11px; color: var(--text-muted);">⏰ ${slot.scheduledTime || "18:00"}</span>
            </div>
            <p style="font-size: 13px; font-weight: 600; margin-top: 2px;">${slot.topic}</p>
            ${slot.target ? `<p style="font-size: 11px; color: var(--text-muted);">${slot.target}</p>` : ""}
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-sm btn-outline" title="Trigger Slot Voice Alarm" onclick="triggerAlarmModal('${slot.subject}', '${safeTopic}', ${slot.durationMinutes})">🔔</button>
            <button class="btn btn-sm btn-primary" onclick="openTimerModal('${slot.subject}', '${safeTopic}', ${slot.durationMinutes})">▶ Focus</button>
          </div>
        `;
        container.appendChild(slotEl);
      });
    }
  }
}

function getTodaySchedule() {
  const todayStr = new Date().toISOString().split("T")[0];
  const found = AppState.schedules.find(s => s.date === todayStr);
  return found || AppState.schedules[0] || null;
}

// TAB 2: RENDER BOOKS
function renderBooksTab() {
  const chipContainer = document.getElementById("subjectChipsContainer");
  const listContainer = document.getElementById("booksListContainer");
  if (!chipContainer || !listContainer) return;

  chipContainer.innerHTML = "";
  listContainer.innerHTML = "";

  AppState.subjects.forEach((subject, idx) => {
    const chip = document.createElement("button");
    chip.className = `chip ${idx === 0 ? "active" : ""}`;
    chip.textContent = AppState.currentLang === "hi" && subject.nameHi ? subject.nameHi : subject.name;
    chip.onclick = () => {
      document.querySelectorAll("#subjectChipsContainer .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderSubjectBooks(subject);
    };
    chipContainer.appendChild(chip);
  });

  if (AppState.subjects.length > 0) {
    renderSubjectBooks(AppState.subjects[0]);
  }
}

function renderSubjectBooks(subject) {
  const container = document.getElementById("booksListContainer");
  container.innerHTML = "";

  subject.books.forEach(book => {
    const bookTitle = AppState.currentLang === "hi" && book.titleHi ? book.titleHi : book.title;
    const bookHeader = document.createElement("h3");
    bookHeader.style.cssText = "font-size: 16px; font-weight: 800; color: var(--primary); margin: 16px 0 10px 0;";
    bookHeader.textContent = bookTitle;
    container.appendChild(bookHeader);

    book.chapters.forEach(ch => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.cssText = "display: flex; align-items: center; gap: 14px; padding: 14px; margin-bottom: 8px; cursor: pointer;";
      card.onclick = () => openChapterModal(subject, ch);

      const title = AppState.currentLang === "hi" && ch.titleHi ? ch.titleHi : ch.title;
      card.innerHTML = `
        <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--primary-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; flex-shrink: 0;">
          ${ch.number}
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 15px; font-weight: 700;">${title}</h4>
          <p style="font-size: 12px; color: var(--text-muted);">${ch.keyConcepts ? ch.keyConcepts.length : 0} Core Topics • ${ch.mcqs ? ch.mcqs.length : 0} MCQs</p>
        </div>
        <span class="status-pill ${ch.progressStatus === "Completed" ? "done" : "pending"}">${ch.progressStatus || "Not Started"}</span>
      `;
      container.appendChild(card);
    });
  });
}

// CHAPTER MODAL DETAILS
function openChapterModal(subject, chapter) {
  AppState.activeChapterData = { subject, chapter };

  document.getElementById("modalChapterSubjectBadge").textContent = subject.name;
  document.getElementById("modalChapterTitle").textContent = `Chapter ${chapter.number}: ${chapter.title}`;
  document.getElementById("modalChapterTitleHi").textContent = chapter.titleHi || "";
  document.getElementById("modalChapterSummaryEn").textContent = chapter.summary || "";
  document.getElementById("modalChapterSummaryHi").textContent = chapter.summaryHi || "";

  // Key Concepts
  const conceptsContainer = document.getElementById("modalChapterKeyConceptsList");
  conceptsContainer.innerHTML = "";
  (chapter.keyConcepts || []).forEach(kc => {
    const p = document.createElement("div");
    p.style.cssText = "background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 12px; margin-bottom: 6px; font-size: 13px;";
    p.textContent = `📌 ${kc}`;
    conceptsContainer.appendChild(p);
  });

  // Formulas
  const formulasContainer = document.getElementById("modalChapterFormulasList");
  formulasContainer.innerHTML = "";
  if (!chapter.formulas || chapter.formulas.length === 0) {
    formulasContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">Key definitions and theory for this chapter are detailed in the Summary tab.</p>`;
  } else {
    chapter.formulas.forEach(f => {
      const p = document.createElement("div");
      p.style.cssText = "background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 14px; font-weight: 700; color: #15803d;";
      p.textContent = `⚡ ${f}`;
      formulasContainer.appendChild(p);
    });
  }

  // Questions
  const qContainer = document.getElementById("modalChapterQuestionsList");
  qContainer.innerHTML = "";
  (chapter.importantQuestions || []).forEach((q, idx) => {
    const qCard = document.createElement("div");
    qCard.className = "card";
    qCard.style.padding = "14px";
    qCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-weight: 800; color: var(--primary);">Q${idx + 1}.</span>
        <span class="status-pill pending" style="font-size: 10px;">${q.marks} Marks</span>
      </div>
      <p style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${q.question}</p>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 10px;">${q.questionHi || ""}</p>
      <div style="background: var(--bg-main); border-radius: 8px; padding: 10px; font-size: 13px; line-height: 1.5;">
        <strong style="color: var(--green);">Solution:</strong> ${q.solution}
      </div>
    `;
    qContainer.appendChild(qCard);
  });

  // MCQs
  const mcqContainer = document.getElementById("modalChapterMcqsList");
  mcqContainer.innerHTML = "";
  (chapter.mcqs || []).forEach((mcq, qIdx) => {
    const mCard = document.createElement("div");
    mCard.className = "card";
    mCard.style.padding = "14px";

    let optionsHtml = "";
    mcq.options.forEach((opt, oIdx) => {
      optionsHtml += `
        <div class="mcq-option" onclick="handleMcqOptionClick(this, ${oIdx}, ${mcq.correctIndex}, '${encodeURIComponent(mcq.explanation)}')">
          <span style="font-weight: 800;">${String.fromCharCode(65 + oIdx)}.</span>
          <span>${opt}</span>
        </div>
      `;
    });

    mCard.innerHTML = `
      <p style="font-weight: 700; font-size: 14px; margin-bottom: 12px;">Q${qIdx + 1}. ${mcq.question}</p>
      <div class="mcq-options-wrapper">${optionsHtml}</div>
      <div class="mcq-explanation-box" style="display: none; background: var(--bg-main); border-radius: 8px; padding: 10px; font-size: 12px; margin-top: 10px; color: var(--text-muted);"></div>
    `;
    mcqContainer.appendChild(mCard);
  });

  // Action Buttons
  document.getElementById("btnModalLaunchTimer").onclick = () => {
    closeModal("modalChapterDetail");
    openTimerModal(subject.name, chapter.title, 45);
  };

  document.getElementById("btnModalToggleComplete").onclick = () => {
    chapter.progressStatus = "Completed";
    renderBooksTab();
    closeModal("modalChapterDetail");
  };

  switchChapterTab("summary");
  openModal("modalChapterDetail");
}

function handleMcqOptionClick(el, selectedIndex, correctIndex, encExp) {
  const parent = el.closest(".card");
  const options = parent.querySelectorAll(".mcq-option");
  options.forEach(o => o.style.pointerEvents = "none");

  if (selectedIndex === correctIndex) {
    el.classList.add("correct");
  } else {
    el.classList.add("wrong");
    options[correctIndex].classList.add("correct");
  }

  const expBox = parent.querySelector(".mcq-explanation-box");
  if (expBox) {
    expBox.style.display = "block";
    expBox.textContent = `💡 Explanation: ${decodeURIComponent(encExp)}`;
  }
}

function switchChapterTab(tabName) {
  const tabs = ["summary", "formulas", "questions", "mcqs"];
  tabs.forEach(t => {
    const pane = document.getElementById(`chapter-tab-${t}`);
    if (pane) pane.style.display = t === tabName ? "block" : "none";
  });

  document.querySelectorAll("#modalChapterDetail .modal-tab-btn").forEach((btn, idx) => {
    btn.classList.toggle("active", tabs[idx] === tabName);
  });
}

// TAB 3: RENDER CALENDAR (15 Nov 2026 - 15 Feb 2027)
function renderCalendarTab() {
  const container = document.getElementById("calendarDaysList");
  if (!container) return;
  container.innerHTML = "";

  const filter = AppState.currentMonthFilter;
  const filtered = AppState.schedules.filter(item => {
    if (filter === "All") return true;
    if (filter === "Phase 1") return (item.phase || "").includes("Phase 1");
    if (filter === "Phase 2") return (item.phase || "").includes("Phase 2");
    if (filter === "Phase 3") return (item.phase || "").includes("Phase 3");
    if (filter === "Phase 4") return (item.phase || "").includes("Phase 4");
    if (filter === "Phase 5") return (item.phase || "").includes("Phase 5");
    return true;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "calendar-day-card";
    card.onclick = () => openEditDayModal(item.dayIndex);

    const dayNum = item.date.split("-")[2];
    const isDone = item.status === "Completed";
    const phaseLabel = item.phase ? item.phase.split(":")[0] : `Day ${item.dayIndex}`;

    let slotsSummary = "";
    if (item.slots && item.slots.length > 0) {
      slotsSummary = item.slots.map(s => `<strong>${s.subject}:</strong> ${s.topic} (${s.durationMinutes}m • ⏰${s.scheduledTime})`).join("<br>");
    } else {
      slotsSummary = item.topic;
    }

    card.innerHTML = `
      <div class="day-badge ${isDone ? "done" : ""}">
        <span class="num">${dayNum}</span>
        <span class="dow">${item.dayOfWeek.substring(0, 3)}</span>
      </div>
      <div style="flex: 1;">
        <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
          <span style="font-size: 11px; font-weight: 700; color: var(--primary); background: var(--primary-subtle); padding: 2px 6px; border-radius: 4px;">
            ${phaseLabel}
          </span>
          <span style="font-size: 11px; color: var(--text-subtle);">Day ${item.dayIndex} (${item.date})</span>
          ${item.isSunday ? `<span style="font-size: 10px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: bold;">⚡ Sunday Buffer Day</span>` : ""}
        </div>
        <div style="font-size: 12px; color: var(--text-main); line-height: 1.5; margin-top: 4px;">
          ${slotsSummary}
        </div>
      </div>
      <span class="status-pill ${isDone ? "done" : "pending"}">${isDone ? "✓ Done" : "Pending"}</span>
    `;
    container.appendChild(card);
  });
}

function filterCalendar(filterName) {
  AppState.currentMonthFilter = filterName;
  document.querySelectorAll("#calendarMonthChips .chip").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.includes(filterName));
  });
  renderCalendarTab();
}

// EDIT/RESCHEDULE DAY MODAL
function openEditDayModal(dayIndex) {
  const item = AppState.schedules.find(s => s.dayIndex === dayIndex);
  if (!item) return;

  AppState.editingDayIndex = dayIndex;
  document.getElementById("modalEditDayTitle").textContent = `Edit 4-Hour Study Plan • Day ${item.dayIndex}`;
  document.getElementById("modalEditDayDate").textContent = `${item.date} (${item.dayOfWeek}) • ${item.phase || "Phase 1"}`;
  document.getElementById("inputCustomDuration").value = item.estimatedMinutes || 240;
  document.getElementById("inputAlarmTime").value = item.scheduledTime || "06:00";
  document.getElementById("chkAlarmEnabled").checked = item.alarmEnabled !== false;
  document.getElementById("chkStatusDone").checked = item.status === "Completed";

  openModal("modalEditDay");
}

function selectDurationChip(mins) {
  document.getElementById("inputCustomDuration").value = mins;
  document.querySelectorAll("#modalEditDay .chip").forEach(c => {
    c.classList.toggle("active", c.textContent.startsWith(mins.toString()));
  });
}

function saveDayChanges() {
  const idx = AppState.editingDayIndex;
  const item = AppState.schedules.find(s => s.dayIndex === idx);
  if (!item) return;

  const mins = parseInt(document.getElementById("inputCustomDuration").value) || 240;
  const time = document.getElementById("inputAlarmTime").value || "06:00";
  const alarmOn = document.getElementById("chkAlarmEnabled").checked;
  const isDone = document.getElementById("chkStatusDone").checked;

  item.estimatedMinutes = mins;
  item.scheduledTime = time;
  item.alarmEnabled = alarmOn;
  item.status = isDone ? "Completed" : "Pending";

  // Update slots if present
  if (item.slots && item.slots.length > 0) {
    item.slots[0].scheduledTime = time;
    item.slots[0].alarmEnabled = alarmOn;
  }

  saveSchedulesToStorage();
  closeModal("modalEditDay");
  renderCalendarTab();
  renderHomeTab();
}

// TAB 4: RENDER PRACTICE & QUIZ
function renderPracticeTab() {
  renderMockQuiz();
  renderFormulaSheets();
  renderMistakesNotebook();
}

function switchPracticeTab(tab) {
  document.getElementById("practice-quiz-view").style.display = tab === "quiz" ? "block" : "none";
  document.getElementById("practice-formulas-view").style.display = tab === "formulas" ? "block" : "none";
  document.getElementById("practice-mistakes-view").style.display = tab === "mistakes" ? "block" : "none";

  const btns = document.querySelectorAll("#tab-practice .modal-tab-btn");
  btns[0].classList.toggle("active", tab === "quiz");
  btns[1].classList.toggle("active", tab === "formulas");
  btns[2].classList.toggle("active", tab === "mistakes");
}

let quizState = {
  questions: [],
  currentIndex: 0,
  score: 0
};

function renderMockQuiz() {
  const container = document.getElementById("quizContainerCard");
  if (!container) return;

  // Flatten MCQs
  if (quizState.questions.length === 0) {
    const list = [];
    AppState.subjects.forEach(s => {
      s.books.forEach(b => {
        b.chapters.forEach(c => {
          (c.mcqs || []).forEach(m => {
            list.push({ subject: s.name, chapter: c.title, mcq: m });
          });
        });
      });
    });
    quizState.questions = list.sort(() => 0.5 - Math.random()).slice(0, 10);
    quizState.currentIndex = 0;
    quizState.score = 0;
  }

  if (quizState.currentIndex >= quizState.questions.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px;">
        <div style="font-size: 48px;">🏆</div>
        <h3 style="font-size: 22px; font-weight: 800; margin: 12px 0;">Quiz Completed!</h3>
        <p style="font-size: 16px; color: var(--primary); font-weight: 700;">Score: ${quizState.score} / ${quizState.questions.length}</p>
        <p style="font-size: 13px; color: var(--text-muted); margin: 8px 0 20px 0;">Incorrect answers have been saved into your Mistake Notebook for targeted revision.</p>
        <button class="btn btn-primary" onclick="restartQuiz()">Restart New Quiz</button>
      </div>
    `;
    return;
  }

  const curr = quizState.questions[quizState.currentIndex];
  let optionsHtml = "";
  curr.mcq.options.forEach((opt, idx) => {
    optionsHtml += `
      <div class="mcq-option" onclick="handleQuizAnswer(this, ${idx}, ${curr.mcq.correctIndex})">
        <span style="font-weight: 800;">${String.fromCharCode(65 + idx)}.</span>
        <span>${opt}</span>
      </div>
    `;
  });

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <span style="font-size: 13px; color: var(--text-muted);">Question ${quizState.currentIndex + 1} of ${quizState.questions.length}</span>
      <span class="status-pill pending" style="font-size: 11px;">${curr.subject} • ${curr.chapter}</span>
    </div>
    <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">${curr.mcq.question}</h3>
    <div id="quizOptionsList">${optionsHtml}</div>
    <div id="quizExplanationBox" style="display: none; background: var(--bg-main); border-radius: 8px; padding: 12px; margin-top: 14px; font-size: 13px;"></div>
    <button id="btnNextQuizQ" class="btn btn-primary btn-block" style="display: none; margin-top: 16px;" onclick="nextQuizQuestion()">Next Question →</button>
  `;
}

function handleQuizAnswer(el, selectedIdx, correctIdx) {
  const parent = document.getElementById("quizOptionsList");
  const options = parent.querySelectorAll(".mcq-option");
  options.forEach(o => o.style.pointerEvents = "none");

  const curr = quizState.questions[quizState.currentIndex];

  if (selectedIdx === correctIdx) {
    el.classList.add("correct");
    quizState.score += 1;
  } else {
    el.classList.add("wrong");
    options[correctIdx].classList.add("correct");

    // Add to Mistake Notebook
    AppState.mistakes.unshift({
      id: "mistake_" + Date.now(),
      subject: curr.subject,
      chapter: curr.chapter,
      question: curr.mcq.question,
      wrongAnswer: curr.mcq.options[selectedIdx],
      correctAnswer: curr.mcq.options[correctIdx],
      explanation: curr.mcq.explanation,
      date: new Date().toLocaleDateString()
    });
    saveMistakesToStorage();
    renderMistakesNotebook();
  }

  const expBox = document.getElementById("quizExplanationBox");
  expBox.style.display = "block";
  expBox.textContent = `💡 Explanation: ${curr.mcq.explanation}`;

  document.getElementById("btnNextQuizQ").style.display = "block";
}

function nextQuizQuestion() {
  quizState.currentIndex += 1;
  renderMockQuiz();
}

function restartQuiz() {
  quizState.questions = [];
  renderMockQuiz();
}

function renderFormulaSheets() {
  const container = document.getElementById("formulaSheetsContainer");
  if (!container) return;
  container.innerHTML = "";

  const mathAndSci = AppState.subjects.filter(s => s.id === "maths" || s.id === "science");
  mathAndSci.forEach(subj => {
    const h = document.createElement("h3");
    h.style.cssText = "font-size: 16px; font-weight: 800; color: var(--primary); margin: 16px 0 10px 0;";
    h.textContent = `${subj.name} Formula Master Sheet`;
    container.appendChild(h);

    subj.books.forEach(b => {
      b.chapters.forEach(c => {
        if (c.formulas && c.formulas.length > 0) {
          const card = document.createElement("div");
          card.className = "card";
          card.style.padding = "14px";
          let fHtml = "";
          c.formulas.forEach(f => {
            fHtml += `<div style="color: var(--green); font-weight: 700; font-size: 13px; margin: 4px 0;">• ${f}</div>`;
          });
          card.innerHTML = `
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">Ch ${c.number}: ${c.title}</h4>
            ${fHtml}
          `;
          container.appendChild(card);
        }
      });
    });
  });
}

function renderMistakesNotebook() {
  const container = document.getElementById("mistakesNotebookContainer");
  if (!container) return;
  container.innerHTML = "";

  if (AppState.mistakes.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 32px 16px;">
        <div style="font-size: 40px; margin-bottom: 10px;">🎯</div>
        <h4 style="font-size: 16px; font-weight: 800;">Your Mistake Notebook is Clean!</h4>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
          When you attempt quizzes, any incorrect questions are automatically stored here for targeted revision.
        </p>
      </div>
    `;
    return;
  }

  AppState.mistakes.forEach(m => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.padding = "14px";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
        <span style="font-weight: 700; color: var(--primary);">${m.subject} • ${m.chapter}</span>
        <span style="color: var(--text-subtle);">${m.date || ""}</span>
      </div>
      <p style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">${m.question}</p>
      <p style="font-size: 13px; color: var(--red); margin-bottom: 2px;">❌ Your Answer: ${m.wrongAnswer}</p>
      <p style="font-size: 13px; color: var(--green); font-weight: 700; margin-bottom: 6px;">✓ Correct Answer: ${m.correctAnswer}</p>
      <div style="background: var(--bg-main); border-radius: 6px; padding: 8px; font-size: 12px; color: var(--text-muted);">
        💡 ${m.explanation}
      </div>
    `;
    container.appendChild(card);
  });
}

// TAB 5: RENDER PROFILE
function renderProfileTab() {
  if (!AppState.userProfile) return;
  const p = AppState.userProfile;
  document.getElementById("profileNameDisplay").textContent = p.fullName || "Student Name";
  document.getElementById("profileSchoolDisplay").textContent = p.schoolName || "Kendriya Vidyalaya";
  document.getElementById("profileAvatarInitial").textContent = (p.fullName || "S").charAt(0).toUpperCase();
  document.getElementById("currentHindiCourseLabel").textContent = p.hindiCourse || "Course A";
}

function resetAllDataConfirm() {
  if (confirm("Are you sure you want to delete all personal data and reset GuruStudy?")) {
    localStorage.clear();
    location.reload();
  }
}

// ONBOARDING SUBMIT
function saveOnboardingProfile() {
  const name = document.getElementById("onboardName").value.trim();
  const dob = document.getElementById("onboardDob").value;
  const school = document.getElementById("onboardSchool").value.trim();
  const lang = document.getElementById("onboardLanguage").value;
  const hindi = document.getElementById("onboardHindiCourse").value;
  const goal = parseInt(document.getElementById("onboardDailyGoal").value) || 120;

  if (!name) {
    alert("Please enter your full name.");
    return;
  }
  if (!school) {
    alert("Please enter your school name.");
    return;
  }

  AppState.userProfile = {
    fullName: name,
    dateOfBirth: dob,
    className: "Class 10th",
    schoolName: school,
    preferredLanguage: lang,
    hindiCourse: hindi,
    dailyStudyGoalMinutes: goal,
    studyStreak: 1
  };

  saveProfileToStorage();
  closeModal("modalOnboarding");
  applyTranslations();
  renderAllViews();
}

// MODAL CONTROLS
function openModal(id) {
  document.getElementById(id)?.classList.add("open");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
}

// ACTIVE STUDY TIMER ENGINE
function openTimerModal(subject, chapter, minutes) {
  AppState.activeTimer.subject = subject;
  AppState.activeTimer.chapter = chapter;
  AppState.activeTimer.totalSeconds = minutes * 60;
  AppState.activeTimer.remainingSeconds = minutes * 60;
  AppState.activeTimer.isRunning = true;

  document.getElementById("timerSubjectBadge").textContent = subject;
  document.getElementById("timerChapterTitle").textContent = chapter;
  updateTimerUI();

  if (AppState.activeTimer.intervalId) {
    clearInterval(AppState.activeTimer.intervalId);
  }

  AppState.activeTimer.intervalId = setInterval(() => {
    if (AppState.activeTimer.isRunning && AppState.activeTimer.remainingSeconds > 0) {
      AppState.activeTimer.remainingSeconds--;
      updateTimerUI();
    } else if (AppState.activeTimer.remainingSeconds === 0) {
      clearInterval(AppState.activeTimer.intervalId);
      AppState.activeTimer.isRunning = false;
      playHarmonicChime();
      finishTimerWithCelebration();
    }
  }, 1000);

  openModal("modalStudyTimer");
}

function updateTimerUI() {
  const mins = Math.floor(AppState.activeTimer.remainingSeconds / 60);
  const secs = AppState.activeTimer.remainingSeconds % 60;
  const str = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  document.getElementById("timerDisplay").textContent = str;
  document.getElementById("btnTimerToggle").textContent = AppState.activeTimer.isRunning ? "⏸ Pause" : "▶ Resume";

  const total = AppState.activeTimer.totalSeconds || 1;
  const progressRatio = (total - AppState.activeTimer.remainingSeconds) / total;
  const fullDash = 596.9; // 2 * PI * 95
  const offset = fullDash * (1 - progressRatio);
  document.getElementById("timerCircleProgress").style.strokeDashoffset = offset;
}

function toggleTimer() {
  AppState.activeTimer.isRunning = !AppState.activeTimer.isRunning;
  document.getElementById("btnTimerToggle").textContent = AppState.activeTimer.isRunning ? "⏸ Pause" : "▶ Resume";
}

function resetTimer() {
  AppState.activeTimer.remainingSeconds = AppState.activeTimer.totalSeconds;
  updateTimerUI();
}

function closeTimerModal() {
  if (AppState.activeTimer.intervalId) {
    clearInterval(AppState.activeTimer.intervalId);
  }
  AppState.activeTimer.isRunning = false;
  closeModal("modalStudyTimer");
}

function finishTimerWithCelebration() {
  closeTimerModal();

  // Mark today completed
  const today = getTodaySchedule();
  if (today) {
    today.status = "Completed";
    saveSchedulesToStorage();
  }

  if (AppState.userProfile) {
    AppState.userProfile.studyStreak = (AppState.userProfile.studyStreak || 1) + 1;
    saveProfileToStorage();
  }

  renderHomeTab();
  playHarmonicChime();
  alert("🎉 Congratulations! You completed your study session! Keep up the brilliant work!");
}

// WEB AUDIO SYNTHESIZER & TTS VOICE ALARM
function playHarmonicChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.15);
      osc.stop(ctx.currentTime + idx * 0.15 + 1.2);
    });
  } catch (e) {
    console.log("AudioContext chime not supported in this browser environment", e);
  }
}

function triggerAlarmModal(subject, chapter, duration) {
  const name = AppState.userProfile ? AppState.userProfile.fullName : "Rahul";
  document.getElementById("alarmStudentHeading").textContent = `Time to Study, ${name}!`;
  document.getElementById("alarmSubjectName").textContent = subject;
  document.getElementById("alarmChapterName").textContent = chapter;
  document.getElementById("alarmDurationText").textContent = `Duration: ${duration} Minutes`;

  let quote = "";
  if (AppState.currentLang === "hi") {
    quote = `${name} जी, अब आपका ${subject} का पाठ ${chapter} पढ़ने का समय हो गया है! GuruStudy पर पढ़ाई शुरू करें।`;
  } else {
    quote = `Hello ${name}, it is time to study ${subject}: ${chapter} on GuruStudy! Let's start learning.`;
  }
  document.getElementById("alarmSpeechQuote").textContent = `"${quote}"`;

  // Play audio chime
  playHarmonicChime();

  // Speak via Web Speech API Text-to-Speech
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(quote);
    utterance.lang = AppState.currentLang === "hi" ? "hi-IN" : "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  openModal("modalAlarmRinging");
}

function alarmStartStudying() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  closeModal("modalAlarmRinging");
  const subj = document.getElementById("alarmSubjectName").textContent;
  const ch = document.getElementById("alarmChapterName").textContent;
  openTimerModal(subj, ch, 45);
}

function alarmSnooze() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  closeModal("modalAlarmRinging");
  alert("💤 Alarm snoozed for 10 minutes.");
}

function alarmDismiss() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  closeModal("modalAlarmRinging");
}
