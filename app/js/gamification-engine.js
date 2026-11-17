/**
 * GuruStudy - Gamification & Board Exam Readiness Engine (Prompt 19)
 * Calculates readiness percentage (0-100%), XP points, Ranks, and Badges.
 */

class GamificationEngine {
  constructor() {
    this.storageKey = 'gurustudy_gamification_state';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading gamification state:', e);
    }
    return {
      xp: 450, // Initial starter XP
      completedSessionsCount: 0,
      mathsHours: 2.5,
      hasSundayAI: false,
      earlyBirdCount: 1,
      unlockedBadges: ['early_bird']
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Error saving gamification state:', e);
    }
  }

  addXP(amount, reason = '') {
    this.state.xp = (this.state.xp || 0) + amount;
    this.saveState();
    this.checkBadgeUnlocks();
    window.dispatchEvent(new CustomEvent('gurustudy:xp-updated', { detail: { xp: this.state.xp, reason } }));
    return this.state.xp;
  }

  getRank() {
    const xp = this.state.xp || 0;
    if (xp >= 7000) return { title: "GuruStudy Legend", level: 5, color: "#F59E0B", icon: "👑", nextThreshold: null };
    if (xp >= 3500) return { title: "Board Topper 95+", level: 4, color: "#8B5CF6", icon: "🏆", nextThreshold: 7000 };
    if (xp >= 1500) return { title: "Syllabus Warrior", level: 3, color: "#3B82F6", icon: "⚔️", nextThreshold: 3500 };
    if (xp >= 500)  return { title: "Concept Builder", level: 2, color: "#10B981", icon: "🧱", nextThreshold: 1500 };
    return { title: "NCERT Rookie", level: 1, color: "#94A3B8", icon: "🌱", nextThreshold: 500 };
  }

  /**
   * Calculates dynamic readiness percentage (0% – 100%)
   * Formula: Adherence (40%) + Chapter/Video Completion (35%) + Mock Quiz Scores (25%)
   */
  async calculateReadinessScore() {
    let adherenceScore = 0;
    let syllabusScore = 0;
    let mockScore = 0;

    try {
      // 1. Timetable Adherence (40%)
      const logs = await GuruDB.getAllDailyLogs();
      if (logs && logs.length > 0) {
        const totalMinutes = logs.reduce((acc, l) => acc + (l.total_minutes || 0), 0);
        // Expecting ~300 mins per active day
        const expected = Math.max(300, logs.length * 300);
        adherenceScore = Math.min(100, Math.round((totalMinutes / expected) * 100));
      } else {
        adherenceScore = 15; // Starting baseline
      }

      // 2. Syllabus & Video Completion (35%)
      const chapterStatus = await GuruDB.getAllChapterStatuses();
      const chaptersList = Object.values(chapterStatus || {});
      if (chaptersList.length > 0) {
        const completed = chaptersList.filter(c => c.completed).length;
        syllabusScore = Math.min(100, Math.round((completed / Math.max(1, chaptersList.length)) * 100));
      } else {
        syllabusScore = 20; // Default preview
      }

      // 3. Sunday Mock Tests (25%)
      const mocks = await GuruDB.getAllMockResults();
      if (mocks && mocks.length > 0) {
        const avgScore = mocks.reduce((acc, m) => acc + ((m.score / (m.total_marks || 80)) * 100), 0) / mocks.length;
        mockScore = Math.min(100, Math.round(avgScore));
      } else {
        mockScore = 25; // Default preview baseline
      }
    } catch (e) {
      console.warn('Error computing readiness score:', e);
      adherenceScore = 30;
      syllabusScore = 25;
      mockScore = 20;
    }

    const totalReadiness = Math.round(
      (adherenceScore * 0.40) +
      (syllabusScore * 0.35) +
      (mockScore * 0.25)
    );

    return {
      totalReadiness: Math.min(100, Math.max(5, totalReadiness)),
      adherenceScore,
      syllabusScore,
      mockScore
    };
  }

  getBadges() {
    const unlocked = this.state.unlockedBadges || [];
    return [
      {
        id: "early_bird",
        title: "🌅 Early Bird",
        desc: "Started morning study alarm within 5 mins",
        unlocked: unlocked.includes("early_bird"),
        rewardXP: 100
      },
      {
        id: "maths_maestro",
        title: "📐 Maths Maestro",
        desc: "Completed 10+ hours of Mathematics problem-solving",
        unlocked: unlocked.includes("maths_maestro") || (this.state.mathsHours >= 10),
        rewardXP: 150
      },
      {
        id: "sunday_ai",
        title: "🤖 Sunday AI Coder",
        desc: "Completed Sunday AI Code 417 session & Python practice",
        unlocked: unlocked.includes("sunday_ai") || this.state.hasSundayAI,
        rewardXP: 150
      },
      {
        id: "unstoppable_7d",
        title: "🔥 7-Day Unstoppable",
        desc: "7 consecutive mission study days between 20 Nov – 15 Feb",
        unlocked: unlocked.includes("unstoppable_7d"),
        rewardXP: 250
      }
    ];
  }

  checkBadgeUnlocks() {
    let newlyUnlocked = false;
    if (this.state.mathsHours >= 10 && !this.state.unlockedBadges.includes("maths_maestro")) {
      this.state.unlockedBadges.push("maths_maestro");
      newlyUnlocked = true;
    }
    if (this.state.hasSundayAI && !this.state.unlockedBadges.includes("sunday_ai")) {
      this.state.unlockedBadges.push("sunday_ai");
      newlyUnlocked = true;
    }
    if (newlyUnlocked) {
      this.saveState();
      if (typeof triggerConfetti === 'function') triggerConfetti();
    }
  }
}

// Global instance
const guruGamification = new GamificationEngine();
