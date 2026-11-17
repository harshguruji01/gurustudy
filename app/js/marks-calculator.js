/**
 * GuruStudy - CBSE Board Percentage Predictor & 3-Hour Exam Simulator (Prompt 22)
 * Theory (80) + Internal (20) calculator and CBSE real exam hall timer.
 */

class BoardMarksPredictor {
  constructor() {
    this.storageKey = 'gurustudy_marks_predictor_data';
  }

  getDefaultScores() {
    return [
      { subject: "Mathematics (041)", theory: 72, internal: 19 },
      { subject: "Science (086)", theory: 70, internal: 20 },
      { subject: "Social Science (087)", theory: 74, internal: 19 },
      { subject: "English Lang & Lit (184)", theory: 75, internal: 20 },
      { subject: "Hindi / AI (Code 417)", theory: 76, internal: 20 }
    ];
  }

  loadScores() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved marks:', e);
    }
    return this.getDefaultScores();
  }

  saveScores(scores) {
    localStorage.setItem(this.storageKey, JSON.stringify(scores));
  }

  calculatePrediction(scores, targetPercentage = 95) {
    const totalMax = scores.length * 100;
    const totalObtained = scores.reduce((sum, s) => {
      const t = Math.min(80, Math.max(0, parseFloat(s.theory) || 0));
      const i = Math.min(20, Math.max(0, parseFloat(s.internal) || 0));
      return sum + t + i;
    }, 0);

    const overallPct = ((totalObtained / totalMax) * 100).toFixed(1);

    // Best of 5 (if user has >= 5 subjects)
    const subjectTotals = scores.map(s => {
      const t = Math.min(80, Math.max(0, parseFloat(s.theory) || 0));
      const i = Math.min(20, Math.max(0, parseFloat(s.internal) || 0));
      return { subject: s.subject, total: t + i };
    }).sort((a, b) => b.total - a.total);

    const top5 = subjectTotals.slice(0, 5);
    const best5Total = top5.reduce((sum, s) => sum + s.total, 0);
    const best5Pct = ((best5Total / (top5.length * 100)) * 100).toFixed(1);

    // Marks needed to reach target percentage
    const targetMarksRequired = Math.round((targetPercentage / 100) * totalMax);
    const marksShortfall = Math.max(0, targetMarksRequired - totalObtained);

    // Recommendations
    const recommendations = [];
    scores.forEach(s => {
      const t = parseFloat(s.theory) || 0;
      if (t < 70) {
        recommendations.push(`Improve ${s.subject} theory (+${70 - Math.round(t)} marks to reach distinction)`);
      }
    });

    return {
      totalObtained,
      totalMax,
      overallPct,
      best5Pct,
      targetPercentage,
      marksShortfall,
      recommendations: recommendations.length > 0 ? recommendations : ["You are well on track for 95%+ Board Distinction! Keep practicing sample papers."]
    };
  }
}

class ExamHallSimulator {
  constructor() {
    this.totalSeconds = 180 * 60; // 3 Hours = 10,800 seconds
    this.currentSecond = 0;
    this.timerInterval = null;
    this.isRunning = false;
    this.onTick = null;
    this.onPhaseChange = null;
  }

  start(onTick, onPhaseChange) {
    this.onTick = onTick;
    this.onPhaseChange = onPhaseChange;
    this.isRunning = true;

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.currentSecond++;
      if (this.currentSecond >= this.totalSeconds) {
        this.stop();
        if (this.onPhaseChange) this.onPhaseChange('COMPLETED');
        return;
      }

      const phase = this.getCurrentPhase();
      if (this.onTick) this.onTick(this.formatTimeLeft(), phase, this.currentSecond);

      // 15-minute alert trigger
      if (this.totalSeconds - this.currentSecond === 15 * 60) {
        if (typeof GuruAlarmEngine !== 'undefined') {
          GuruAlarmEngine.speakAnnouncement("Attention Student. Fifteen minutes left in the exam. Please verify your roll number, supplementary sheets, and map work.");
        }
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  stop() {
    this.isRunning = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.currentSecond = 0;
  }

  getCurrentPhase() {
    const elapsedMinutes = this.currentSecond / 60;
    if (elapsedMinutes < 15) {
      return {
        name: "Reading Phase (15 Mins)",
        desc: "Read question paper thoroughly. No writing allowed.",
        badgeColor: "#F59E0B"
      };
    } else if (elapsedMinutes < 165) {
      return {
        name: "Writing Phase",
        desc: "Answer structured Section A, B, C, D & E questions with neat diagrams.",
        badgeColor: "#10B981"
      };
    } else {
      return {
        name: "Final Revision Phase (15 Mins)",
        desc: "Check roll number, tie supplementary sheets, review math calculations & maps.",
        badgeColor: "#EF4444"
      };
    }
  }

  formatTimeLeft() {
    const remaining = Math.max(0, this.totalSeconds - this.currentSecond);
    const hrs = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;
    return `${hrs}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }
}

// Global instances
const guruMarksPredictor = new BoardMarksPredictor();
const guruExamSimulator = new ExamHallSimulator();
