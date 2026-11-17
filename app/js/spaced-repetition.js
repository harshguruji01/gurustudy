/**
 * GuruStudy - Spaced Repetition Revision Engine (Prompt 23)
 * Implements scientific Ebbinghaus memory retention queue:
 * R1 (+1d), R2 (+3d), R3 (+7d), R4 (+21d) capped at 15 Feb 2027.
 */

class SpacedRepetitionEngine {
  constructor() {
    this.storageKey = 'gurustudy_spaced_revisions';
  }

  getAllQueue() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Error reading spaced repetition queue:', e);
    }
    // Default starter revision items
    return [
      {
        id: "rev_real_num",
        subject: "Mathematics",
        chapter: "Real Numbers",
        checkpoint: "R2 (+3d)",
        dueDate: "2026-11-20",
        completed: false
      },
      {
        id: "rev_chem_rxn",
        subject: "Science",
        chapter: "Chemical Reactions and Equations",
        checkpoint: "R1 (+1d)",
        dueDate: "2026-11-20",
        completed: false
      }
    ];
  }

  saveQueue(queue) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    } catch (e) {
      console.warn('Error saving spaced repetition queue:', e);
    }
  }

  /**
   * Automatically schedules 4 revision intervals when chapter marked complete:
   * +1d, +3d, +7d, +21d capped at 2027-02-15
   */
  scheduleChapterRevisions(subject, chapterTitle, baseDate = new Date()) {
    const queue = this.getAllQueue();
    const intervals = [
      { tag: "R1 (+1d)", days: 1 },
      { tag: "R2 (+3d)", days: 3 },
      { tag: "R3 (+7d)", days: 7 },
      { tag: "R4 (+21d)", days: 21 }
    ];

    const maxEnd = new Date(2027, 1, 15); // 15 Feb 2027

    intervals.forEach((step, idx) => {
      const targetDate = new Date(baseDate.getTime() + step.days * 24 * 60 * 60 * 1000);
      const effectiveDate = targetDate > maxEnd ? maxEnd : targetDate;
      const dateStr = effectiveDate.toISOString().split('T')[0];

      queue.push({
        id: `rev_${Date.now()}_${idx}`,
        subject,
        chapter: chapterTitle,
        checkpoint: step.tag,
        dueDate: dateStr,
        completed: false
      });
    });

    this.saveQueue(queue);
    window.dispatchEvent(new CustomEvent('gurustudy:revisions-updated', { detail: { count: queue.length } }));
  }

  getDueRevisions(date = new Date()) {
    const dateStr = (date instanceof Date ? date : new Date(date)).toISOString().split('T')[0];
    const all = this.getAllQueue();
    return all.filter(item => !item.completed && item.dueDate <= dateStr);
  }

  markCompleted(id) {
    const all = this.getAllQueue();
    const item = all.find(i => i.id === id);
    if (item) {
      item.completed = true;
      this.saveQueue(all);
      window.dispatchEvent(new CustomEvent('gurustudy:revisions-updated', { detail: { id } }));
    }
  }
}

// Global instance
const guruSpacedRevision = new SpacedRepetitionEngine();
