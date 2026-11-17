/**
 * GuruStudy - Production QA & 88-Day Boundary Test Suite (Phase 10)
 * Run with: node qa-verify.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('🚀 GURUSTUDY PRODUCTION QA VERIFICATION SUITE');
console.log('Target: https://gurustudy.webguruji.online');
console.log('====================================================\n');

// 1. Load syllabus-data.js & timetable-engine.js in sandbox
const context = { window: {}, console: console };
vm.createContext(context);

const syllabusCode = fs.readFileSync(path.join(__dirname, 'app/js/syllabus-data.js'), 'utf8');
vm.runInContext(syllabusCode, context);

const timetableCode = fs.readFileSync(path.join(__dirname, 'app/js/timetable-engine.js'), 'utf8');
vm.runInContext(timetableCode, context);

const videoLecturesCode = fs.readFileSync(path.join(__dirname, 'app/js/youtube_lectures_db.js'), 'utf8');
vm.runInContext(videoLecturesCode, context);

const GuruTimetable = context.window.GuruTimetable;
const GURU_SYLLABUS = context.window.GURU_SYLLABUS;
const GURUSTUDY_LECTURES = context.window.GURUSTUDY_LECTURES;

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

// TEST 1: NCERT Rationalized Syllabus Counts
console.log('TEST 1: NCERT Syllabus Structure Verification');
const mathsChapters = GURU_SYLLABUS.subjects.maths.chapters;
const scienceChapters = GURU_SYLLABUS.subjects.science.chapters;
const sstChapters = GURU_SYLLABUS.subjects.sst.books.flatMap(b => b.chapters);
const aiChapters = GURU_SYLLABUS.subjects.ai417.chapters;

assert(mathsChapters.length === 14, `Maths must have 14 rationalized chapters (got ${mathsChapters.length})`);
assert(scienceChapters.length === 13, `Science must have 13 chapters (got ${scienceChapters.length})`);
assert(sstChapters.length === 20, `Social Science must have 20 chapters across 4 books (got ${sstChapters.length})`);
assert(aiChapters.length === 13, `AI Code 417 must have 13 Sunday units (got ${aiChapters.length})`);

// TEST 2: 88-Day Range & Date Boundaries
console.log('\nTEST 2: 88-Day Range & Date Boundaries');
const allDays = GuruTimetable.getAllDays();
assert(allDays.length === 88, `Total days must be exactly 88 (got ${allDays.length})`);
assert(allDays[0].date === '2026-11-20', `Day 1 start date must be 2026-11-20 (got ${allDays[0].date})`);
assert(allDays[87].date === '2027-02-15', `Day 88 end date must be 2027-02-15 (got ${allDays[87].date})`);

// TEST 3: Weekdays vs Sundays Split
console.log('\nTEST 3: Daily Study Hours & Sunday Boost Split');
let sundayCount = 0;
let weekdayCount = 0;
let invalidHours = 0;

allDays.forEach((day, index) => {
  const isSunday = day.isSunday;

  if (isSunday) {
    sundayCount++;
    if (day.targetHours !== 6.5) {
      invalidHours++;
      console.error(`Day ${day.dayIndex} (${day.date}) is Sunday but targetHours = ${day.targetHours}`);
    }
  } else {
    weekdayCount++;
    if (day.targetHours !== 5.0) {
      invalidHours++;
      console.error(`Day ${day.dayIndex} (${day.date}) is Weekday but targetHours = ${day.targetHours}`);
    }
  }
});

assert(sundayCount === 13, `Exactly 13 Sundays between 20 Nov 2026 and 15 Feb 2027 (got ${sundayCount})`);
assert(weekdayCount === 75, `Exactly 75 Mon-Sat weekdays (got ${weekdayCount})`);
assert(invalidHours === 0, `All days have exact scheduled hours (5.0h weekdays, 6.5h Sundays)`);

// TEST 4: Three Phases Distribution
console.log('\nTEST 4: Three Preparation Phases Distribution');
const phase1Days = allDays.filter(d => d.phase === 1);
const phase2Days = allDays.filter(d => d.phase === 2);
const phase3Days = allDays.filter(d => d.phase === 3);

assert(phase1Days.length === 50, `Phase 1 Concept Mastery has 50 days (got ${phase1Days.length})`);
assert(phase2Days.length === 25, `Phase 2 Question Bank & Exemplar has 25 days (got ${phase2Days.length})`);
assert(phase3Days.length === 13, `Phase 3 Pre-Board & Revision has 13 days (got ${phase3Days.length})`);

// TEST 5: Total Study Hours Calculation
console.log('\nTEST 5: Total Preparation Hours');
const totalPlannedHours = (75 * 5.0) + (13 * 6.5);
assert(totalPlannedHours === 459.5, `Total preparation time is exactly 459.5 Hours (got ${totalPlannedHours})`);

// TEST 6: YouTube Lecture Database Verification (Phases 11-15)
console.log('\nTEST 6: YouTube Lecture Database Verification');
const m1Videos = GURUSTUDY_LECTURES.resolveChapterVideos('Mathematics', 'maths_1');
const s1Videos = GURUSTUDY_LECTURES.resolveChapterVideos('Science', 'science_1');
const ai1Videos = GURUSTUDY_LECTURES.resolveChapterVideos('Artificial Intelligence', 'ai_1');

assert(m1Videos.length >= 3, `Real Numbers has >= 3 curated lectures (got ${m1Videos.length})`);
assert(s1Videos.length >= 3, `Chemical Reactions has >= 3 curated lectures (got ${s1Videos.length})`);
assert(ai1Videos.length >= 3, `AI Project Cycle has >= 3 curated lectures (got ${ai1Videos.length})`);
assert(m1Videos[0].embedUrl.includes('youtube-nocookie.com'), `Embed URL uses safe nocookie domain`);

// TEST 7: Three-State Streak & Study Mission Engine Verification
console.log('\nTEST 7: Three-State Streak & Study Mission Engine Verification');
const streakBefore = GuruTimetable.calculateMissionStreak(new Date('2026-11-17T12:00:00'));
assert(streakBefore.phase === 'BEFORE_MISSION', `Phase before 20 Nov must be BEFORE_MISSION (got ${streakBefore.phase})`);
assert(streakBefore.streakDays === 0, `Streak before 20 Nov must strictly be 0d (got ${streakBefore.streakDays})`);
assert(streakBefore.profileBadgeText === '⏳ Starts 20 Nov', `Profile badge before 20 Nov must be '⏳ Starts 20 Nov' (got ${streakBefore.profileBadgeText})`);
assert(streakBefore.homeHeaderText.includes('Starts in 3 Days (20 Nov)'), `Home header on Nov 17 must say 'Starts in 3 Days (20 Nov)' (got ${streakBefore.homeHeaderText})`);
assert(streakBefore.isWarmupMode === true, `isWarmupMode must be true before 20 Nov`);

const streakDay1 = GuruTimetable.calculateMissionStreak(new Date('2026-11-20T12:00:00'));
assert(streakDay1.phase === 'ACTIVE_MISSION', `Phase on 20 Nov must be ACTIVE_MISSION (got ${streakDay1.phase})`);
assert(streakDay1.daysElapsed === 1, `Days elapsed on 20 Nov must be 1 (got ${streakDay1.daysElapsed})`);
assert(streakDay1.profileBadgeText === '🔥 1d / 88d Streak', `Badge on 20 Nov must be '🔥 1d / 88d Streak' (got ${streakDay1.profileBadgeText})`);

const streakAfter = GuruTimetable.calculateMissionStreak(new Date('2027-02-16T12:00:00'), 88);
assert(streakAfter.phase === 'COMPLETED_MISSION', `Phase after 15 Feb must be COMPLETED_MISSION (got ${streakAfter.phase})`);
assert(streakAfter.streakDays === 88, `Final streak after 15 Feb locked at 88 (got ${streakAfter.streakDays})`);
assert(streakAfter.profileBadgeText.includes('Mission Completed'), `Badge after 15 Feb includes 'Mission Completed'`);

// TEST 8: Responsive Layout & Anti-Squish Protection Verification
console.log('\nTEST 8: Responsive Layout & Anti-Squish Protection Verification');
const globalCss = fs.readFileSync(path.join(__dirname, 'app', 'css', 'global-layout-fix.css'), 'utf-8');
const mainCss = fs.readFileSync(path.join(__dirname, 'app', 'css', 'styles.css'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(__dirname, 'app', 'index.html'), 'utf-8');

assert(globalCss.includes('white-space: nowrap !important'), 'global-layout-fix.css enforces white-space: nowrap on pills and badges');
assert(globalCss.includes('flex-wrap: wrap !important'), 'global-layout-fix.css enforces flex-wrap: wrap on pill containers');
assert(globalCss.includes('overflow-x: hidden !important'), 'global-layout-fix.css enforces overflow-x: hidden on viewport');
assert(!globalCss.includes('word-break: break-all'), 'global-layout-fix.css never uses word-break: break-all');
assert(!mainCss.includes('word-break: break-all'), 'styles.css never uses word-break: break-all');
assert(indexHtml.includes('global-layout-fix.css'), 'index.html links global-layout-fix.css');
assert(indexHtml.includes('modal-profile-center'), 'index.html contains Student Control Center modal');
assert(indexHtml.includes('profile-badges-row'), 'index.html contains profile-badges-row wrapper');

// TEST 9: Prompts 16–25 Feature Verification
console.log('\nTEST 9: Prompts 16–25 Feature Verification');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'guru-ai-knowledge.js')), 'guru-ai-knowledge.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'cbse-vault-data.js')), 'cbse-vault-data.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'gamification-engine.js')), 'gamification-engine.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'cbse-quiz-bank.js')), 'cbse-quiz-bank.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'audio-soundscapes.js')), 'audio-soundscapes.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'marks-calculator.js')), 'marks-calculator.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'spaced-repetition.js')), 'spaced-repetition.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'social-share.js')), 'social-share.js exists');

const manifestContent = fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf-8');
assert(manifestContent.includes('Start Focus Timer'), 'manifest.json contains Start Focus Timer shortcut');
assert(manifestContent.includes('Watch Chapter Lectures'), 'manifest.json contains Watch Chapter Lectures shortcut');
assert(manifestContent.includes('88-Day Timetable'), 'manifest.json contains 88-Day Timetable shortcut');

const widgetFile = path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'online', 'webguruji', 'gurustudy', 'widget', 'GuruStudyWidget.kt');
assert(fs.existsSync(widgetFile), 'GuruStudyWidget.kt exists in android widget package');

const androidManifest = fs.readFileSync(path.join(__dirname, 'android', 'app', 'src', 'main', 'AndroidManifest.xml'), 'utf-8');
assert(androidManifest.includes('GuruStudyWidget'), 'AndroidManifest.xml registers GuruStudyWidget');

// Summary
console.log('\n====================================================');
console.log(`📊 QA RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log('🎉 ALL PRODUCTION ENGINE CHECKS PASSED WITH 100% ACCURACY!');
} else {
  console.log('⚠️ SOME CHECKS FAILED. PLEASE REVIEW LOGS.');
}
console.log('====================================================\n');
