/**
 * GuruStudy - Central Reactive State Management & Persistence Engine (`store.js`)
 * URL: https://gurustudy.webguruji.online
 *
 * Implements Web App UI Prompt 6:
 * - Single source of truth backed by localStorage ('gurustudy_state_v2')
 * - Pub/Sub subscription system (subscribe, setState)
 * - Auto-reset & daily rollover engine
 * - Reactive DOM data-bind engine
 * - Strict Mission Window: 20 Nov 2026 – 15 Feb 2027 (88 Days)
 *
 * Author: HarshGuruJi (contact@webguruji.online)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gurustudy_state_v2';
  const MISSION_START = '2026-11-20';
  const MISSION_END = '2027-02-15';
  const TOTAL_MISSION_DAYS = 88;

  function getTodayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getDefaultState() {
    const today = getTodayString();
    return {
      profile: {
        name: 'Class 10 Topper',
        class: '10th',
        section: 'A',
        school: 'CBSE Affiliated',
        medium: 'English',
        targetPercent: 95,
        dailyStartTime: '16:00', // 4:00 PM
        onboardingDone: true,
        hindiCourse: 'Course A',
        theme: 'dark'
      },
      mission: {
        startDate: MISSION_START,
        endDate: MISSION_END,
        totalDays: TOTAL_MISSION_DAYS
      },
      todayLog: {
        date: today,
        completedMinutesBySubject: {
          maths: 0,
          science: 0,
          sst: 0,
          lang: 0,
          ai: 0
        },
        completedSlots: []
      },
      syllabusProgress: {},
      alarms: {
        enabled: true,
        voiceEnabled: true,
        ringtone: 'chime',
        customSlots: []
      },
      quizHistory: [],
      bookmarkedVideos: [],
      historyLogs: {}, // date -> log object
      xpPoints: 120,
      streakGraceShields: 1
    };
  }

  class Store {
    constructor() {
      this.subscribers = new Map();
      this.state = this.loadState();
      this.checkAndPerformDailyRollover();
      this.initCrossTabSync();
    }

    loadState() {
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            // Merge with default state in case new fields were added
            return {
              ...getDefaultState(),
              ...parsed,
              profile: { ...getDefaultState().profile, ...(parsed.profile || {}) },
              mission: { ...getDefaultState().mission, ...(parsed.mission || {}) },
              todayLog: { ...getDefaultState().todayLog, ...(parsed.todayLog || {}) }
            };
          }
        }
      } catch (e) {
        console.warn('[GuruStore] Error reading state from storage, resetting to default:', e);
      }
      const initial = getDefaultState();
      this.persist(initial);
      return initial;
    }

    persist(stateToSave) {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave || this.state));
        }
      } catch (e) {
        console.error('[GuruStore] Failed to persist state:', e);
      }
    }

    getState() {
      return this.state;
    }

    setState(patch) {
      if (!patch || typeof patch !== 'object') return;
      const oldState = this.state;
      this.state = {
        ...this.state,
        ...patch
      };
      this.persist(this.state);
      this.notify(patch, oldState);
      this.updateBoundDOM();
    }

    subscribe(key, callback) {
      if (typeof callback !== 'function') return () => {};
      if (!this.subscribers.has(key)) {
        this.subscribers.set(key, new Set());
      }
      this.subscribers.get(key).add(callback);
      return () => {
        const set = this.subscribers.get(key);
        if (set) set.delete(callback);
      };
    }

    notify(patch, oldState) {
      for (const [key, set] of this.subscribers.entries()) {
        if (key === '*' || Object.prototype.hasOwnProperty.call(patch, key)) {
          set.forEach(cb => {
            try {
              cb(this.state[key], oldState ? oldState[key] : undefined, this.state);
            } catch (err) {
              console.error(`[GuruStore] Listener error for key '${key}':`, err);
            }
          });
        }
      }
    }

    initCrossTabSync() {
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === STORAGE_KEY && e.newValue) {
            try {
              const externalState = JSON.parse(e.newValue);
              this.state = externalState;
              this.notify(externalState, null);
              this.updateBoundDOM();
            } catch (_) {}
          }
        });
      }
    }

    checkAndPerformDailyRollover() {
      const today = getTodayString();
      if (this.state.todayLog && this.state.todayLog.date !== today) {
        // Archive yesterday's log
        const yesterdayDate = this.state.todayLog.date;
        const history = { ...(this.state.historyLogs || {}) };
        if (yesterdayDate) {
          history[yesterdayDate] = this.state.todayLog;
        }

        this.state = {
          ...this.state,
          historyLogs: history,
          todayLog: {
            date: today,
            completedMinutesBySubject: {
              maths: 0,
              science: 0,
              sst: 0,
              lang: 0,
              ai: 0
            },
            completedSlots: []
          }
        };
        this.persist(this.state);
        this.notify({ todayLog: this.state.todayLog, historyLogs: this.state.historyLogs }, null);
      }
    }

    addStudyMinutes(minutes, subjectKey = 'maths') {
      const mins = parseInt(minutes, 10) || 0;
      if (mins <= 0) return;

      const subKey = String(subjectKey).toLowerCase();
      const current = { ...(this.state.todayLog.completedMinutesBySubject || {}) };
      current[subKey] = (current[subKey] || 0) + mins;

      const newXP = (this.state.xpPoints || 0) + Math.round(mins * 1.5);

      this.setState({
        todayLog: {
          ...this.state.todayLog,
          completedMinutesBySubject: current
        },
        xpPoints: newXP
      });
    }

    /**
     * Strict 3-Phase Streak Calculator
     * 20 Nov 2026 – 15 Feb 2027 (88 Days)
     */
    calculateMissionStreak() {
      const todayStr = getTodayString();
      const startMs = new Date(MISSION_START + 'T00:00:00').getTime();
      const endMs = new Date(MISSION_END + 'T23:59:59').getTime();
      const todayMs = new Date(todayStr + 'T00:00:00').getTime();

      const msPerDay = 86400000;

      // Phase 1: Before launch (strictly 0 streak)
      if (todayMs < startMs) {
        const daysToStart = Math.ceil((startMs - todayMs) / msPerDay);
        return {
          phase: 'BEFORE_MISSION',
          streakDays: 0,
          totalMissionDays: TOTAL_MISSION_DAYS,
          badgeText: '⏳ Starts 20 Nov',
          homeCountdownText: `Starts in ${daysToStart} Days (20 Nov)`,
          isWarmupMode: true,
          daysElapsed: 0,
          daysRemaining: TOTAL_MISSION_DAYS
        };
      }

      // Phase 2: Active Mission Window (20 Nov 2026 – 15 Feb 2027)
      if (todayMs <= endMs) {
        const daysElapsed = Math.floor((todayMs - startMs) / msPerDay) + 1;
        const daysRemaining = Math.max(0, TOTAL_MISSION_DAYS - daysElapsed);
        const streak = Math.min(daysElapsed, TOTAL_MISSION_DAYS);
        return {
          phase: 'ACTIVE_MISSION',
          streakDays: streak,
          totalMissionDays: TOTAL_MISSION_DAYS,
          badgeText: `🔥 ${streak}d / 88d Streak`,
          homeCountdownText: `Day ${streak} of 88 • 2027 Board Mission`,
          isWarmupMode: false,
          daysElapsed: daysElapsed,
          daysRemaining: daysRemaining
        };
      }

      // Phase 3: Completed Mission Window (After 15 Feb 2027)
      return {
        phase: 'COMPLETED_MISSION',
        streakDays: TOTAL_MISSION_DAYS,
        totalMissionDays: TOTAL_MISSION_DAYS,
        badgeText: '🏆 Mission Completed • Final Streak: 88d / 88d',
        homeCountdownText: 'Mission Completed! Best of Luck for Board Exams!',
        isWarmupMode: false,
        daysElapsed: TOTAL_MISSION_DAYS,
        daysRemaining: 0
      };
    }

    bindDOM() {
      this.updateBoundDOM();
    }

    updateBoundDOM() {
      if (typeof document === 'undefined') return;
      const elements = document.querySelectorAll('[data-bind]');
      elements.forEach(el => {
        const bindPath = el.getAttribute('data-bind');
        if (!bindPath) return;

        let val = this.state;
        const parts = bindPath.split('.');
        for (const part of parts) {
          if (val && Object.prototype.hasOwnProperty.call(val, part)) {
            val = val[part];
          } else {
            val = undefined;
            break;
          }
        }

        if (val !== undefined && val !== null) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
            if (el.value !== String(val)) {
              el.value = val;
            }
          } else {
            el.textContent = String(val);
          }
        }
      });
    }
  }

  // Instantiate singleton
  const storeInstance = new Store();
  if (typeof window !== 'undefined') {
    window.GuruStore = storeInstance;
  }

  // Run DOM binding when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => storeInstance.bindDOM());
    } else {
      storeInstance.bindDOM();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GuruStore: storeInstance };
  }
})();
