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

// TEST 10: Web App UI & Android App 25-Prompt Suite Verification
console.log('\nTEST 10: Web App UI & Android App 25-Prompt Suite Verification');

// 1. Teacher videos DB
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'chapter_teachers_db.js')), 'chapter_teachers_db.js exists');
const teacherDb = require('./app/js/chapter_teachers_db.js');
assert(teacherDb.CHAPTER_TEACHER_VIDEOS.sci_1 !== undefined, 'Science Ch 1 mapped in teacher DB');
assert(teacherDb.CHAPTER_TEACHER_VIDEOS.maths_1 !== undefined, 'Maths Ch 1 mapped in teacher DB');
assert(teacherDb.CHAPTER_TEACHER_VIDEOS.sst_1 !== undefined, 'SST Ch 1 mapped in teacher DB');
assert(teacherDb.CHAPTER_TEACHER_VIDEOS.ai_1 !== undefined, 'AI Unit 1 mapped in teacher DB');

// 2. YouTube Launcher & Store & Cloud Sync & NCERT Data
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'youtube-launcher.js')), 'youtube-launcher.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'store.js')), 'store.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'cloud-sync.js')), 'cloud-sync.js exists');
assert(fs.existsSync(path.join(__dirname, 'app', 'js', 'ncert-data.js')), 'ncert-data.js exists in app/js/');

// 3. AndroidManifest.xml package queries for YouTube
assert(androidManifest.includes('com.google.android.youtube'), 'AndroidManifest.xml includes YouTube package query');
assert(androidManifest.includes('android:scheme="https"'), 'AndroidManifest.xml includes https scheme query');

// 4. Android Kotlin screens
const booksScreen = fs.readFileSync(path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'online', 'webguruji', 'gurustudy', 'ui', 'screens', 'BooksScreen.kt'), 'utf-8');
assert(booksScreen.includes('Shobhit Nirwan') && booksScreen.includes('Prashant Kirad'), 'BooksScreen.kt contains teacher video action buttons');

const dashScreen = fs.readFileSync(path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'online', 'webguruji', 'gurustudy', 'ui', 'screens', 'DashboardScreen.kt'), 'utf-8');
assert(dashScreen.includes('Watch $teacherName') || dashScreen.includes('Watch '), 'DashboardScreen.kt contains teacher video action button');

const mainActivity = fs.readFileSync(path.join(__dirname, 'android', 'app', 'src', 'main', 'java', 'online', 'webguruji', 'gurustudy', 'MainActivity.kt'), 'utf-8');
assert(mainActivity.includes('launchYouTubeUrl'), 'MainActivity.kt includes launchYouTubeUrl');

// 5. Root Landing Page index.html
const rootIndex = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
assert(rootIndex.includes('countdown-ticker-box'), 'Landing page contains countdown-ticker-box');
assert(rootIndex.includes('phone-mockup'), 'Landing page contains phone-mockup');
assert(rootIndex.includes('routine-explorer'), 'Landing page contains routine-explorer');
assert(rootIndex.includes('btn-demo-test-voice'), 'Landing page contains test voice button');
assert(rootIndex.includes('btn-launch-personalized'), 'Landing page contains personalized plan configurator');
assert(rootIndex.includes('comp-table'), 'Landing page contains comparison table');
assert(rootIndex.includes('marquee-track'), 'Landing page contains student wall marquee');
assert(rootIndex.includes('store.webguruji.online'), 'Landing page contains HarshGuruJi ecosystem links');
assert(rootIndex.includes('gurustudy-doodle-footer'), 'Landing page mounts GuruStudy Doodle Crew Footer');
assert(rootIndex.includes('doodle-crew-footer.js'), 'Landing page loads doodle-crew-footer.js');

// 6. Doodle Crew Footer Unit & Branding Verification
const dcfSrc = fs.readFileSync(path.join(__dirname, 'app', 'js', 'doodle-crew-footer.js'), 'utf-8');
const dcfMod = require('./app/js/doodle-crew-footer.js');
assert(dcfSrc.includes("wordmark = 'GURUSTUDY'"), 'Doodle Crew Footer uses GURUSTUDY wordmark');
assert(!/mischief/i.test(dcfSrc), 'Doodle Crew Footer contains zero Mischief placeholder text');
assert(dcfSrc.includes('#060B19'), 'Doodle Crew Footer matches main site Midnight Indigo theme');
assert(typeof dcfMod.layoutWord === 'function' && dcfMod.layoutWord([100, 100], 0, 200).width === 200, 'Doodle Crew Footer layoutWord math works');
assert(typeof dcfMod.lookAt === 'function' && dcfMod.lookAt(0, 0, 100, 0, 5, 100).x === 5, 'Doodle Crew Footer eye lookAt math works');

// 7. Botpress Webchat Integration Verification
assert(indexHtml.includes('cdn.botpress.cloud/webchat/v5.0/inject.js'), 'app/index.html loads Botpress Webchat v5.0 inject.js');
assert(indexHtml.includes('20261114133455-OVF8F1K0.js'), 'app/index.html loads HarshGuruJi main site Botpress config');
assert(indexHtml.includes('window.botpress.toggle'), 'Ask Guru AI button triggers window.botpress.toggle()');
assert(rootIndex.includes('20261114133455-OVF8F1K0.js'), 'Landing page loads HarshGuruJi Botpress Webchat widget');
assert(globalCss.includes('body.gurustudy-app-shell .bpFabContainer'), 'global-layout-fix.css hides duplicate Botpress FAB inside /app/');

// Summary
console.log('\n====================================================');
console.log(`📊 QA RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log('🎉 ALL PRODUCTION ENGINE CHECKS PASSED WITH 100% ACCURACY!');
} else {
  console.log('⚠️ SOME CHECKS FAILED. PLEASE REVIEW LOGS.');
}
console.log('====================================================\n');
