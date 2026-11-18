/**
 * GuruStudy - Persistent Work Completion & Chapter Mastery Engine (`completion-manager.js`)
 * URL: https://gurustudy.webguruji.online/app/
 *
 * Central persistence layer for Web App Android Parity:
 * - Today's per-slot completion state (survives refresh & syncs with GuruStore/GuruDB)
 * - 88-Day Blueprint per-day completion state
 * - 4-Step NCERT Chapter Mastery (NCERT Reading, Exercises, Board PYQs, Revision)
 * - Chapter Bookmarks, Personal Notes & "Continue Reading" tracker
 *
 * Author: HarshGuruJi (contact@webguruji.online)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gurustudy_completion_v1';

  function getDefaultData() {
    return {
      version: 1,
      completedSlotsByDate: {}, // { 'YYYY-MM-DD': { '0': true, '1': true } }
      completedDays: {},        // { '1': true, '2': true, ... }
      chapterMastery: {},       // { [chapterId]: { ncertRead, exercisesDone, pyqDone, revisionDone, bookmarked, notes } }
      lastRead: null            // { subject, chapterId, chapterTitle, updatedAt }
    };
  }

  class CompletionManager {
    constructor() {
      this.data = this.load();
      this.listeners = new Set();
    }

    load() {
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            return {
              ...getDefaultData(),
              ...parsed,
              completedSlotsByDate: parsed.completedSlotsByDate || {},
              completedDays: parsed.completedDays || {},
              chapterMastery: parsed.chapterMastery || {}
            };
          }
        }
      } catch (e) {
        console.warn('[CompletionManager] Failed to load state:', e);
      }
      return getDefaultData();
    }

    save() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        }
        // Mirror syllabusProgress into GuruStore if available
        if (typeof window !== 'undefined' && window.GuruStore && typeof window.GuruStore.setState === 'function') {
          window.GuruStore.setState({
            syllabusProgress: this.data.chapterMastery
          });
        }
      } catch (e) {
        console.error('[CompletionManager] Failed to persist state:', e);
      }
      this.emit();
    }

    subscribe(fn) {
      if (typeof fn === 'function') this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    emit() {
      this.listeners.forEach((fn) => {
        try { fn(this.data); } catch (_) {}
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gurustudy:completion-updated', { detail: this.data }));
      }
    }

    /* =========================================================================
       1. SLOT COMPLETION (Today / Selected Date)
       ========================================================================= */
    isSlotDone(dateStr, slotIndex) {
      const dayMap = this.data.completedSlotsByDate[dateStr];
      return Boolean(dayMap && dayMap[String(slotIndex)]);
    }

    getCompletedSlotsCount(dateStr) {
      const dayMap = this.data.completedSlotsByDate[dateStr];
      if (!dayMap) return 0;
      return Object.values(dayMap).filter(Boolean).length;
    }

    toggleSlotDone(dateStr, slotIndex, forceState) {
      if (!dateStr) return false;
      if (!this.data.completedSlotsByDate[dateStr]) {
        this.data.completedSlotsByDate[dateStr] = {};
      }
      const key = String(slotIndex);
      const nextState = typeof forceState === 'boolean' ? forceState : !this.data.completedSlotsByDate[dateStr][key];
      this.data.completedSlotsByDate[dateStr][key] = nextState;
      this.save();
      return nextState;
    }

    /* =========================================================================
       2. 88-DAY PLAN COMPLETION (Days 1–88)
       ========================================================================= */
    isDayDone(dayNumber) {
      return Boolean(this.data.completedDays[String(dayNumber)]);
    }

    toggleDayDone(dayNumber, forceState) {
      const key = String(dayNumber);
      const nextState = typeof forceState === 'boolean' ? forceState : !this.data.completedDays[key];
      if (nextState) {
        this.data.completedDays[key] = true;
      } else {
        delete this.data.completedDays[key];
      }
      this.save();
      return nextState;
    }

    getCompletedDaysCount() {
      return Object.keys(this.data.completedDays).filter((k) => this.data.completedDays[k]).length;
    }

    /* =========================================================================
       3. CHAPTER 4-STEP MASTERY, BOOKMARKS & NOTES
       ========================================================================= */
    getChapterMastery(chapterId) {
      const existing = this.data.chapterMastery[chapterId] || {};
      return {
        ncertRead: Boolean(existing.ncertRead),
        exercisesDone: Boolean(existing.exercisesDone),
        pyqDone: Boolean(existing.pyqDone),
        revisionDone: Boolean(existing.revisionDone),
        bookmarked: Boolean(existing.bookmarked),
        notes: existing.notes || ''
      };
    }

    toggleChapterStep(chapterId, stepKey, forceState) {
      const validKeys = ['ncertRead', 'exercisesDone', 'pyqDone', 'revisionDone'];
      if (!validKeys.includes(stepKey)) return false;
      const cur = this.getChapterMastery(chapterId);
      cur[stepKey] = typeof forceState === 'boolean' ? forceState : !cur[stepKey];
      this.data.chapterMastery[chapterId] = cur;
      this.save();
      return cur[stepKey];
    }

    toggleChapterComplete(chapterId, forceComplete) {
      const cur = this.getChapterMastery(chapterId);
      const isCurrentlyDone = this.getChapterProgressPct(chapterId) === 100;
      const target = typeof forceComplete === 'boolean' ? forceComplete : !isCurrentlyDone;
      cur.ncertRead = target;
      cur.exercisesDone = target;
      cur.pyqDone = target;
      cur.revisionDone = target;
      this.data.chapterMastery[chapterId] = cur;
      this.save();
      return target;
    }

    toggleBookmark(chapterId) {
      const cur = this.getChapterMastery(chapterId);
      cur.bookmarked = !cur.bookmarked;
      this.data.chapterMastery[chapterId] = cur;
      this.save();
      return cur.bookmarked;
    }

    saveChapterNotes(chapterId, text) {
      const cur = this.getChapterMastery(chapterId);
      cur.notes = String(text || '');
      this.data.chapterMastery[chapterId] = cur;
      this.save();
    }

    getChapterProgressPct(chapterId) {
      const m = this.getChapterMastery(chapterId);
      const count = [m.ncertRead, m.exercisesDone, m.pyqDone, m.revisionDone].filter(Boolean).length;
      return count * 25;
    }

    getChapterStatus(chapterId) {
      const pct = this.getChapterProgressPct(chapterId);
      if (pct >= 100) return 'Completed';
      if (pct > 0) return 'In Progress';
      return 'Not Started';
    }

    getOverallSyllabusStats(allChaptersList) {
      const list = Array.isArray(allChaptersList)
        ? allChaptersList
        : (typeof GURU_SYLLABUS !== 'undefined' && typeof GURU_SYLLABUS.getAllChapters === 'function'
            ? GURU_SYLLABUS.getAllChapters()
            : []);
      const total = list.length || 0;
      let completed = 0;
      let inProgress = 0;
      let pctSum = 0;

      for (const ch of list) {
        const pct = this.getChapterProgressPct(ch.id);
        pctSum += pct;
        if (pct >= 100) completed++;
        else if (pct > 0) inProgress++;
      }

      return {
        totalCount: total,
        completedCount: completed,
        inProgressCount: inProgress,
        overallPct: total > 0 ? Math.round(pctSum / total) : 0
      };
    }

    /* =========================================================================
       4. CONTINUE READING TRACKER
       ========================================================================= */
    setLastRead(subject, chapterId, chapterTitle) {
      this.data.lastRead = {
        subject: subject || 'Mathematics',
        chapterId: chapterId || '',
        chapterTitle: chapterTitle || '',
        updatedAt: new Date().toISOString()
      };
      this.save();
    }

    getLastRead() {
      return this.data.lastRead;
    }
  }

  const instance = new CompletionManager();
  if (typeof window !== 'undefined') {
    window.GuruCompletion = instance;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CompletionManager, GuruCompletion: instance };
  }
})();
