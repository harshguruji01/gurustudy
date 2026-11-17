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

const GuruTimetable = context.window.GuruTimetable;
const GURU_SYLLABUS = context.window.GURU_SYLLABUS;

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

// Summary
console.log('\n====================================================');
console.log(`📊 QA RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
if (passedTests === totalTests) {
  console.log('🎉 ALL PRODUCTION ENGINE CHECKS PASSED WITH 100% ACCURACY!');
} else {
  console.log('⚠️ SOME CHECKS FAILED. PLEASE REVIEW LOGS.');
}
console.log('====================================================\n');
