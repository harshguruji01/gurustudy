/**
 * GuruStudy - 88-Day Deterministic NCERT Timetable Engine
 * Date Range: 20 November 2026 to 15 February 2027 (88 Days)
 * 75 Working Days (5.0 Hours) + 13 Sundays (6.5 Hours with AI Code 417)
 * Author: HarshGuruJi (contact@webguruji.online)
 */

class TimetableEngine {
  constructor() {
    this.startDate = new Date(2026, 10, 20); // 20 Nov 2026 (Month is 0-indexed)
    this.endDate = new Date(2027, 1, 15);   // 15 Feb 2027
    this.totalDays = 88;
  }

  /**
   * Format Date to YYYY-MM-DD in local time
   */
  formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Determine the 3 curriculum phases
   */
  getPhaseForDay(dayIndex) {
    if (dayIndex <= 50) {
      return {
        phase: 1,
        name: 'Phase 1: Deep NCERT Concepts & Mastery',
        badge: 'Foundation & Concepts (Days 1–50)',
        color: '#3B82F6'
      };
    } else if (dayIndex <= 75) {
      return {
        phase: 2,
        name: 'Phase 2: Question Bank & Exemplar Revision',
        badge: 'Exemplar & PYQs (Days 51–75)',
        color: '#10B981'
      };
    } else {
      return {
        phase: 3,
        name: 'Phase 3: High-Yield Revision & Pre-Board Mocks',
        badge: 'Pre-Board Marathon (Days 76–88)',
        color: '#F59E0B'
      };
    }
  }

  /**
   * Convert 24-hr time string "HH:MM" to 12-hr with AM/PM
   */
  formatTime12(timeStr) {
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  /**
   * Add minutes to "HH:MM" string and return new "HH:MM" string
   */
  addMinutes(timeStr, minsToAdd) {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMins = (h * 60 + m + minsToAdd) % (24 * 60);
    const newH = Math.floor(totalMins / 60);
    const newM = totalMins % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  }

  /**
   * Generate structured study slots based on start time and day type
   */
  generateSlots(startTime = '16:00', isSunday = false, secondLang = 'Hindi Course A', dayOfWeek = 'Friday', aiEnabled = true) {
    const slots = [];
    let currentTime = startTime;

    if (!isSunday) {
      // -------------------------------------------------------------
      // MON–SAT WORKING DAY: 5.0 HOURS (300 MINS)
      // Slot 1: Mathematics (120m)
      // Slot 2: Science (90m)
      // Slot 3: Social Science (60m)
      // Slot 4: Language (30m) - Mon/Wed/Fri: English, Tue/Thu/Sat: Hindi
      // -------------------------------------------------------------
      const langChoice = (dayOfWeek === 'Monday' || dayOfWeek === 'Wednesday' || dayOfWeek === 'Friday')
        ? 'English'
        : secondLang;

      // Slot 1: Mathematics
      const mathEnd = this.addMinutes(currentTime, 120);
      slots.push({
        id: 'slot_1_maths',
        subject: 'Mathematics',
        icon: '📐',
        color: '#3B82F6',
        durationMinutes: 120,
        startTime: currentTime,
        endTime: mathEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(mathEnd)}`,
        focusGoal: 'NCERT Examples, Solved Problems & In-Depth Concept Derivations'
      });
      currentTime = this.addMinutes(mathEnd, 10); // 10-minute break

      // Slot 2: Science
      const sciEnd = this.addMinutes(currentTime, 90);
      slots.push({
        id: 'slot_2_science',
        subject: 'Science',
        icon: '🔬',
        color: '#10B981',
        durationMinutes: 90,
        startTime: currentTime,
        endTime: sciEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(sciEnd)}`,
        focusGoal: 'Physics / Chemistry / Biology Daily Rotation & Core Diagrams'
      });
      currentTime = this.addMinutes(sciEnd, 10); // 10-minute break

      // Slot 3: Social Science
      const sstEnd = this.addMinutes(currentTime, 60);
      slots.push({
        id: 'slot_3_sst',
        subject: 'Social Science',
        icon: '🌍',
        color: '#F59E0B',
        durationMinutes: 60,
        startTime: currentTime,
        endTime: sstEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(sstEnd)}`,
        focusGoal: 'History / Geography / Civics / Economics Case Studies & Timelines'
      });
      currentTime = this.addMinutes(sstEnd, 10); // 10-minute break

      // Slot 4: Language
      const langEnd = this.addMinutes(currentTime, 30);
      slots.push({
        id: 'slot_4_lang',
        subject: langChoice,
        icon: langChoice === 'English' ? '📖' : '🪔',
        color: '#EC4899',
        durationMinutes: 30,
        startTime: currentTime,
        endTime: langEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(langEnd)}`,
        focusGoal: langChoice === 'English' ? 'Grammar, Analytical Paragraph & Literature Prose' : 'क्षितिज/स्पर्श गद्य, पद्य एवं व्यावहारिक व्याकरण'
      });

    } else {
      // -------------------------------------------------------------
      // SUNDAY SPECIAL BOOST: 6.5 HOURS (390 MINS)
      // Slot 1: Mathematics (120m) - Weekly Test & Weak Concept Revision
      // Slot 2: Science (120m) - Marathon, Chemical Equations & Numericals
      // Slot 3: Social Science (90m) - Map Work & 5-Mark Long Answers
      // Slot 4: Language (30m) - Writing Skills & Unseen Passage
      // Slot 5: Artificial Intelligence (30m) - Code 417 Chapter
      // -------------------------------------------------------------
      
      // Slot 1: Maths Marathon
      const mathEnd = this.addMinutes(currentTime, 120);
      slots.push({
        id: 'slot_sun_maths',
        subject: 'Mathematics',
        icon: '📐',
        color: '#3B82F6',
        durationMinutes: 120,
        startTime: currentTime,
        endTime: mathEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(mathEnd)}`,
        focusGoal: 'Sunday Weekly Chapter Test & Weak Concept Remediation'
      });
      currentTime = this.addMinutes(mathEnd, 10);

      // Slot 2: Science Marathon
      const sciEnd = this.addMinutes(currentTime, 120);
      slots.push({
        id: 'slot_sun_science',
        subject: 'Science',
        icon: '🔬',
        color: '#10B981',
        durationMinutes: 120,
        startTime: currentTime,
        endTime: sciEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(sciEnd)}`,
        focusGoal: 'Physics Numericals, Ray Diagrams & Chemistry Balancing Drills'
      });
      currentTime = this.addMinutes(sciEnd, 10);

      // Slot 3: SST Marathon
      const sstEnd = this.addMinutes(currentTime, 90);
      slots.push({
        id: 'slot_sun_sst',
        subject: 'Social Science',
        icon: '🌍',
        color: '#F59E0B',
        durationMinutes: 90,
        startTime: currentTime,
        endTime: sstEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(sstEnd)}`,
        focusGoal: 'Official CBSE Map Work & 5-Mark Structured Answer Writing'
      });
      currentTime = this.addMinutes(sstEnd, 10);

      // Slot 4: Language Master
      const langEnd = this.addMinutes(currentTime, 30);
      slots.push({
        id: 'slot_sun_lang',
        subject: 'English & Hindi Writing Skills',
        icon: '✍️',
        color: '#EC4899',
        durationMinutes: 30,
        startTime: currentTime,
        endTime: langEnd,
        displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(langEnd)}`,
        focusGoal: 'Letter Writing, Analytical Paragraphs & Formal Composition'
      });
      currentTime = this.addMinutes(langEnd, 10);

      // Slot 5: Artificial Intelligence (Subject Code 417)
      if (aiEnabled) {
        const aiEnd = this.addMinutes(currentTime, 30);
        slots.push({
          id: 'slot_sun_ai',
          subject: 'Artificial Intelligence (Code 417)',
          icon: '🤖',
          color: '#8B5CF6',
          durationMinutes: 30,
          startTime: currentTime,
          endTime: aiEnd,
          displayTime: `${this.formatTime12(currentTime)} – ${this.formatTime12(aiEnd)}`,
          focusGoal: 'Sunday Special 1 Full Chapter: Python, Data Science, CV & Ethics'
        });
      }
    }

    return slots;
  }

  /**
   * Generate complete deterministic dataset for all 88 days
   */
  generateAll88Days(userProfile = {}) {
    const days = [];
    const startTime = userProfile.dailyStartTime || '16:00';
    const secondLang = userProfile.secondLanguage || 'Hindi Course A';
    const aiEnabled = userProfile.aiSundayEnabled !== false;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let sundayCounter = 0;
    const cur = new Date(this.startDate.getTime());

    for (let dayIndex = 1; dayIndex <= this.totalDays; dayIndex++) {
      const dayOfWeek = daysOfWeek[cur.getDay()];
      const isSunday = (dayOfWeek === 'Sunday');
      const dateKey = this.formatDateKey(cur);

      if (isSunday) {
        sundayCounter++;
      }

      const phaseInfo = this.getPhaseForDay(dayIndex);
      const targetHours = isSunday ? (aiEnabled ? 6.5 : 6.0) : 5.0;
      const targetMinutes = isSunday ? (aiEnabled ? 390 : 360) : 300;

      // Assign chapters dynamically
      const assignedTopics = this.getAssignedTopicsForDay(dayIndex, isSunday, sundayCounter, secondLang);

      // Generate exact time slots
      const slots = this.generateSlots(startTime, isSunday, secondLang, dayOfWeek, aiEnabled);

      // Attach specific assigned chapter to slots
      if (slots.length >= 1 && assignedTopics.maths) slots[0].assignedChapter = assignedTopics.maths;
      if (slots.length >= 2 && assignedTopics.science) slots[1].assignedChapter = assignedTopics.science;
      if (slots.length >= 3 && assignedTopics.sst) slots[2].assignedChapter = assignedTopics.sst;
      if (slots.length >= 4 && assignedTopics.language) slots[3].assignedChapter = assignedTopics.language;
      if (isSunday && slots.length >= 5 && assignedTopics.ai) slots[4].assignedChapter = assignedTopics.ai;

      days.push({
        dayIndex,
        date: dateKey,
        dayOfWeek,
        isSunday,
        sundayIndex: isSunday ? sundayCounter : null,
        formattedDate: `${cur.getDate()} ${months[cur.getMonth()]} ${cur.getFullYear()}`,
        shortDate: `${cur.getDate()} ${months[cur.getMonth()].substring(0, 3)}`,
        month: months[cur.getMonth()],
        year: cur.getFullYear(),
        phase: phaseInfo.phase,
        phaseName: phaseInfo.name,
        phaseBadge: phaseInfo.badge,
        targetHours,
        targetMinutes,
        assignedTopics,
        slots
      });

      // Advance one day
      cur.setDate(cur.getDate() + 1);
    }

    return days;
  }

  /**
   * Deterministically assigns micro-topics and chapters to each of the 88 days
   */
  getAssignedTopicsForDay(dayIndex, isSunday, sundayCount, secondLang) {
    if (typeof GURU_SYLLABUS === 'undefined') {
      return {
        maths: `Mathematics Session (Day ${dayIndex})`,
        science: `Science Session (Day ${dayIndex})`,
        sst: `Social Science Session (Day ${dayIndex})`,
        language: `Language Revision (Day ${dayIndex})`,
        ai: isSunday ? `AI Unit ${sundayCount}` : null
      };
    }

    const mathsChapters = GURU_SYLLABUS.subjects.maths.chapters;
    const scienceChapters = GURU_SYLLABUS.subjects.science.chapters;
    const allSstChapters = [];
    GURU_SYLLABUS.subjects.sst.books.forEach(b => {
      b.chapters.forEach(c => allSstChapters.push(`${c.title} (${b.bookName.split(':')[0]})`));
    });

    const aiChapters = GURU_SYLLABUS.subjects.ai417.chapters;

    let mathsTopic, scienceTopic, sstTopic, langTopic, aiTopic = null;

    if (dayIndex <= 60) {
      // Phase 1: 1st Full NCERT Reading & Exercises
      const mIdx = (dayIndex - 1) % mathsChapters.length;
      mathsTopic = `Ch ${mathsChapters[mIdx].no}: ${mathsChapters[mIdx].title} (NCERT Reading & Exercises)`;

      const sIdx = (dayIndex - 1) % scienceChapters.length;
      scienceTopic = `Ch ${scienceChapters[sIdx].no}: ${scienceChapters[sIdx].title} (${scienceChapters[sIdx].branch} Concepts)`;

      const sstIdx = (dayIndex - 1) % allSstChapters.length;
      sstTopic = `Ch ${sstIdx + 1}: ${allSstChapters[sstIdx]} (In-Depth Case Study)`;

      langTopic = (dayIndex % 2 === 1)
        ? `English: Unit ${(Math.floor(dayIndex / 2) % 9) + 1} Literature & Vocabulary`
        : `${secondLang}: इकाई ${(Math.floor(dayIndex / 2) % 12) + 1} पाठ व्याख्या एवं प्रश्नोत्तर`;

    } else if (dayIndex <= 78) {
      // Phase 2: Sample Papers & PYQs
      const mIdx = (dayIndex - 61) % mathsChapters.length;
      mathsTopic = `Ch ${mathsChapters[mIdx].no}: ${mathsChapters[mIdx].title} (CBSE PYQs & Exemplar 4/5-markers)`;

      const sIdx = (dayIndex - 61) % scienceChapters.length;
      scienceTopic = `Ch ${scienceChapters[sIdx].no}: ${scienceChapters[sIdx].title} (High-Yield Assertion-Reason & Numericals)`;

      const sstIdx = (dayIndex - 61) % allSstChapters.length;
      sstTopic = `SST: ${allSstChapters[sstIdx]} (CBSE 5-Mark Answer Structuring)`;

      langTopic = `Board Pattern Sample Paper Questions & Creative Writing Drill`;

    } else {
      // Phase 3: Final Sprint & High Yield Formulas
      mathsTopic = `Maths Sprint: Fast Formula Revision, Geometry Theorems & Speed Mock Test`;
      scienceTopic = `Science Sprint: 25 Master Diagrams & All Chemistry Reaction Equations`;
      sstTopic = `SST Sprint: Complete 100% CBSE Map Work & Timeline Recall`;
      langTopic = `Language Sprint: Formal Formats, Notice Writing & Grammar Master Rulebook`;
    }

    if (isSunday) {
      const aiIdx = (sundayCount - 1) % aiChapters.length;
      const aiChap = aiChapters[aiIdx];
      aiTopic = `${aiChap.part}: ${aiChap.unit} (${aiChap.keyFocus})`;
    }

    return {
      maths: mathsTopic,
      science: scienceTopic,
      sst: sstTopic,
      language: langTopic,
      ai: aiTopic
    };
  }

  /**
   * Get specific day item matching today's date or specified date
   */
  getDayByDate(dateStr, userProfile = {}) {
    const allDays = this.generateAll88Days(userProfile);
    return allDays.find(d => d.date === dateStr) || allDays[0];
  }

  /**
   * Get day item by 1-based index (1 to 88)
   */
  getDayByIndex(dayIndex, userProfile = {}) {
    const allDays = this.generateAll88Days(userProfile);
    const idx = Math.max(1, Math.min(this.totalDays, dayIndex));
    return allDays[idx - 1];
  }

  /**
   * Alias for generateAll88Days
   */
  getAllDays(userProfile = {}) {
    return this.generateAll88Days(userProfile);
  }

  /**
   * Get convenient day schedule for dashboard
   */
  getDaySchedule(date = new Date(), userProfile = {}) {
    const dStr = typeof date === 'string' ? date : this.formatDateKey(date);
    const day = this.getDayByDate(dStr, userProfile);
    return {
      dayNumber: day.dayIndex,
      dateStr: day.date,
      formattedDate: day.formattedDate,
      isSunday: day.isSunday,
      totalHours: day.targetHours,
      phase: day.phaseName,
      phaseNumber: day.phase,
      schedule: day.slots.map(s => {
        let chTitle = '';
        if (s.assignedChapter) {
          chTitle = typeof s.assignedChapter === 'string' 
            ? s.assignedChapter 
            : (s.assignedChapter.title || s.assignedChapter.chapter || s.assignedChapter.unit || JSON.stringify(s.assignedChapter));
        } else {
          chTitle = s.focusGoal || s.subject;
        }
        return {
          subject: s.subject,
          chapter: chTitle,
          durationMinutes: s.durationMinutes,
          startTime: s.startTime,
          endTime: s.endTime,
          description: s.focusGoal || ''
        };
      })
    };
  }
}

// Global instance
const guruTimetable = new TimetableEngine();

if (typeof window !== 'undefined') {
  window.GuruTimetable = guruTimetable;
  window.TimetableEngine = TimetableEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TimetableEngine, guruTimetable };
}
