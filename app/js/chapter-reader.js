/**
 * GuruStudy - Interactive Bilingual NCERT Chapter Reader (`chapter-reader.js`)
 * URL: https://gurustudy.webguruji.online/app/
 *
 * Brings Android's ChapterDetailScreen.kt into the Web App:
 * - Resolves rich NCERT textbook content from window.NCERT_DATA (EN & हिंदी)
 * - Reader Customization Bar: Dark / Sepia / Light themes, A- / A / A+ font sizing, Bookmark, Focus Timer launch
 * - 5 Interactive Tabs:
 *   1. Summary (English + हिंदी, Key Concepts, Top Teacher YouTube Buttons)
 *   2. Formulas (Equations, Identities & Laws)
 *   3. Board Q&A (Important CBSE Questions with expandable step-by-step solutions)
 *   4. Chapter MCQs (Instant right/wrong feedback with NCERT explanations)
 *   5. Mastery & Notes (4-Step Checklist + auto-saving Personal Notes)
 *
 * Author: HarshGuruJi (contact@webguruji.online)
 */

(function () {
  'use strict';

  const THEME_KEY = 'gurustudy_reader_theme';
  const FONT_KEY = 'gurustudy_reader_font_delta';

  function normalizeText(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function resolveNcertChapterData(chapterObj) {
    const dataset = typeof window !== 'undefined' && Array.isArray(window.NCERT_DATA)
      ? window.NCERT_DATA
      : (typeof NCERT_DATA !== 'undefined' && Array.isArray(NCERT_DATA) ? NCERT_DATA : []);

    const targetTitle = normalizeText(chapterObj.chapterName || chapterObj.title || '');
    const subjHint = normalizeText(chapterObj.subject || '');

    let bestMatch = null;
    let bestScore = 0;

    for (const subj of dataset) {
      const sName = normalizeText(subj.name + ' ' + subj.id);
      const subjMatches =
        (subjHint.includes('math') && sName.includes('math')) ||
        (subjHint.includes('sci') && !subjHint.includes('social') && sName.includes('science') && !sName.includes('social')) ||
        ((subjHint.includes('sst') || subjHint.includes('social')) && sName.includes('social')) ||
        (subjHint.includes('eng') && sName.includes('english')) ||
        (subjHint.includes('hin') && sName.includes('hindi')) ||
        ((subjHint.includes('ai') || subjHint.includes('417')) && (sName.includes('ai') || sName.includes('it')));

      for (const book of subj.books || []) {
        for (const ch of book.chapters || []) {
          const cTitle = normalizeText(ch.title);
          let score = 0;
          if (cTitle === targetTitle) score = 100;
          else if (cTitle.includes(targetTitle) || targetTitle.includes(cTitle)) score = 75;
          else {
            const targetWords = targetTitle.split(' ').filter((w) => w.length > 3);
            const hits = targetWords.filter((w) => cTitle.includes(w)).length;
            if (hits > 0) score = Math.min(65, hits * 22);
          }
          if (subjMatches) score += 20;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = ch;
          }
        }
      }
    }

    if (bestMatch && bestScore >= 40) {
      return bestMatch;
    }

    // Graceful fallback from GURU_SYLLABUS chapter metadata
    const topics = Array.isArray(chapterObj.keyTopics) ? chapterObj.keyTopics : [];
    return {
      number: chapterObj.no || 1,
      title: chapterObj.chapterName || chapterObj.title || 'NCERT Chapter',
      titleHi: '',
      summary: `Official CBSE Class 10 ${chapterObj.subject || ''} chapter covering: ${topics.length ? topics.join(', ') : 'core NCERT concepts, solved examples, and board exam problems'}. Focus on line-by-line NCERT reading and past 5-year board questions.`,
      summaryHi: `कक्षा 10 सीबीएसई ${chapterObj.subject || ''} अध्याय — मुख्य एनसीईआरटी अवधारणाएँ, अभ्यास प्रश्न और बोर्ड परीक्षा के महत्वपूर्ण प्रश्न।`,
      keyConcepts: topics.length ? topics : ['Read NCERT Textbook Line-by-Line', 'Practice All Back Exercise Questions', 'Review CBSE Board PYQs & Marking Scheme'],
      formulas: [],
      importantQuestions: [
        {
          question: `Write a concise Board-exam ready summary and key points for "${chapterObj.chapterName || chapterObj.title}".`,
          questionHi: '',
          solution: `Focus on definitions, labelled diagrams/formulas, and NCERT exemplar problems for ${chapterObj.chapterName || chapterObj.title}.`,
          marks: 3
        }
      ],
      mcqs: []
    };
  }

  const ChapterReader = {
    currentChapter: null,
    currentNcert: null,
    activeTab: 'summary',
    theme: 'dark',
    fontDelta: 0,
    mcqState: {},

    init() {
      try {
        if (typeof localStorage !== 'undefined') {
          this.theme = localStorage.getItem(THEME_KEY) || 'dark';
          this.fontDelta = parseInt(localStorage.getItem(FONT_KEY) || '0', 10) || 0;
        }
      } catch (_) {}
    },

    open(chapterObj) {
      if (!chapterObj) return;
      this.init();
      this.currentChapter = chapterObj;
      this.currentNcert = resolveNcertChapterData(chapterObj);
      this.activeTab = 'summary';
      this.mcqState = {};

      // Save "Continue Reading" progress
      if (window.GuruCompletion) {
        window.GuruCompletion.setLastRead(
          chapterObj.subject || 'NCERT',
          chapterObj.id,
          chapterObj.chapterName || chapterObj.title
        );
      }

      const modal = document.getElementById('modal-chapter-reader');
      if (!modal) return;
      this.render();
      modal.classList.add('active');
    },

    close() {
      const modal = document.getElementById('modal-chapter-reader');
      if (modal) modal.classList.remove('active');
      if (typeof window.refreshSyllabusProgressUI === 'function') {
        window.refreshSyllabusProgressUI();
      }
    },

    setTheme(newTheme) {
      this.theme = ['dark', 'sepia', 'light'].includes(newTheme) ? newTheme : 'dark';
      try { localStorage.setItem(THEME_KEY, this.theme); } catch (_) {}
      this.render();
    },

    setFontDelta(delta) {
      this.fontDelta = Math.max(-2, Math.min(4, delta));
      try { localStorage.setItem(FONT_KEY, String(this.fontDelta)); } catch (_) {}
      this.render();
    },

    setTab(tabKey) {
      this.activeTab = tabKey;
      this.render();
    },

    render() {
      const box = document.getElementById('chapter-reader-shell');
      if (!box || !this.currentChapter || !this.currentNcert) return;

      const ch = this.currentChapter;
      const nc = this.currentNcert;
      const mastery = window.GuruCompletion
        ? window.GuruCompletion.getChapterMastery(ch.id)
        : { ncertRead: false, exercisesDone: false, pyqDone: false, revisionDone: false, bookmarked: false, notes: '' };
      const pct = window.GuruCompletion ? window.GuruCompletion.getChapterProgressPct(ch.id) : 0;

      box.setAttribute('data-reader-theme', this.theme);
      const fontSizePx = 14 + this.fontDelta;

      const teacherVideos = typeof window.getChapterTeacherVideos === 'function'
        ? window.getChapterTeacherVideos(ch.id || ch.chapterName)
        : [];

      let tabBodyHtml = '';

      if (this.activeTab === 'summary') {
        const conceptsHtml = (nc.keyConcepts || [])
          .map((c) => `<li class="reader-concept-item">✦ ${c}</li>`)
          .join('');
        const teachersHtml = teacherVideos
          .map((tv, idx) => `
            <a href="${tv.youtubeUrl}" target="_blank" rel="noopener noreferrer"
               class="yt-teacher-btn ${tv.teacherName.includes('Pandey') || tv.teacherName.includes('PW') ? 'btn-pw' : ''}"
               data-chapter-id="${ch.id}" data-video-idx="${idx}" data-yt-url="${tv.youtubeUrl}">
              ▶ ${tv.teacherName} • ${tv.badgeLabel}
            </a>
          `)
          .join('');

        tabBodyHtml = `
          <div class="reader-card">
            <div class="reader-section-label">📖 Chapter Summary (English)</div>
            <p class="reader-prose" style="font-size:${fontSizePx}px;">${nc.summary || ''}</p>
            ${nc.summaryHi ? `
              <div class="reader-section-label" style="margin-top: 14px;">🇮🇳 अध्याय सारांश (हिंदी)</div>
              <p class="reader-prose" style="font-size:${fontSizePx}px; opacity: 0.92;">${nc.summaryHi}</p>
            ` : ''}
          </div>

          ${conceptsHtml ? `
            <div class="reader-card">
              <div class="reader-section-label">💡 Key Concepts to Master</div>
              <ul class="reader-concepts-list" style="font-size:${fontSizePx - 1}px;">${conceptsHtml}</ul>
            </div>
          ` : ''}

          ${teachersHtml ? `
            <div class="reader-card">
              <div class="reader-section-label" style="color: #F87171;">🎥 Top Teacher Video Lectures</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">${teachersHtml}</div>
            </div>
          ` : ''}
        `;
      } else if (this.activeTab === 'formulas') {
        const formulas = nc.formulas || [];
        tabBodyHtml = formulas.length
          ? `<div class="reader-card">
              <div class="reader-section-label">📐 Key Formulas, Equations & Laws</div>
              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
                ${formulas.map((f) => `<div class="reader-formula-chip" style="font-size:${fontSizePx}px;">${f}</div>`).join('')}
              </div>
            </div>`
          : `<div class="reader-card" style="text-align: center; padding: 28px 16px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">📖</div>
              <div class="reader-prose" style="font-size:${fontSizePx}px;">This theory chapter has no separate algebraic formulas — focus on <strong>Summary</strong> & <strong>Board Q&A</strong>!</div>
            </div>`;
      } else if (this.activeTab === 'qa') {
        const qs = nc.importantQuestions || [];
        tabBodyHtml = qs.length
          ? qs.map((q, idx) => `
              <div class="reader-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
                  <div class="reader-prose" style="font-weight: 700; font-size:${fontSizePx}px;">Q${idx + 1}. ${q.question}</div>
                  ${q.marks ? `<span class="badge" style="background: rgba(99,102,241,0.2); color: #A5B4FC; padding: 3px 8px; border-radius: 999px; font-size: 0.7rem;">${q.marks}M</span>` : ''}
                </div>
                ${q.questionHi ? `<div class="reader-prose" style="font-size:${fontSizePx - 1}px; opacity: 0.78; margin-bottom: 8px;">${q.questionHi}</div>` : ''}
                <details class="reader-solution-details">
                  <summary style="cursor: pointer; font-weight: 700; font-size: 0.8rem; color: #10B981;">👁️ Reveal Step-by-Step Board Solution</summary>
                  <p class="reader-prose" style="margin-top: 8px; font-size:${fontSizePx - 1}px;">${q.solution}</p>
                </details>
              </div>
            `).join('')
          : `<div class="reader-card">No board questions listed yet for this chapter.</div>`;
      } else if (this.activeTab === 'mcqs') {
        const mcqs = nc.mcqs || [];
        tabBodyHtml = mcqs.length
          ? mcqs.map((m, qIdx) => {
              const chosen = this.mcqState[qIdx];
              const answered = typeof chosen === 'number';
              const optsHtml = (m.options || []).map((opt, oIdx) => {
                let cls = 'reader-mcq-opt';
                if (answered) {
                  if (oIdx === m.correctIndex) cls += ' is-correct';
                  else if (oIdx === chosen) cls += ' is-wrong';
                }
                return `<button type="button" class="${cls}" data-mcq-q="${qIdx}" data-mcq-o="${oIdx}" style="font-size:${fontSizePx - 1}px;">
                  ${String.fromCharCode(65 + oIdx)}. ${opt}
                </button>`;
              }).join('');
              return `
                <div class="reader-card">
                  <div class="reader-prose" style="font-weight: 700; margin-bottom: 10px; font-size:${fontSizePx}px;">MCQ ${qIdx + 1}. ${m.question}</div>
                  <div style="display: flex; flex-direction: column; gap: 6px;">${optsHtml}</div>
                  ${answered && m.explanation ? `<div class="reader-mcq-exp">💡 <strong>Explanation:</strong> ${m.explanation}</div>` : ''}
                </div>
              `;
            }).join('')
          : `<div class="reader-card" style="text-align: center; padding: 28px 16px;">
              <div style="font-size: 1.8rem; margin-bottom: 8px;">🎯</div>
              <div class="reader-prose" style="font-size:${fontSizePx}px;">Practice mixed CBSE MCQs & Assertion-Reason questions in the <strong>Focus & Practice</strong> tab!</div>
            </div>`;
      } else if (this.activeTab === 'mastery') {
        const steps = [
          { key: 'ncertRead', label: '📖 NCERT Line-by-Line Reading' },
          { key: 'exercisesDone', label: '✍️ NCERT Back Exercises & Examples' },
          { key: 'pyqDone', label: '📝 Past 5-Year Board PYQs' },
          { key: 'revisionDone', label: '🔁 Final Formula & Concept Revision' }
        ];
        tabBodyHtml = `
          <div class="reader-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
              <div class="reader-section-label" style="margin: 0;">✅ 4-Step Chapter Mastery</div>
              <span class="badge" style="background: ${pct === 100 ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'}; color: ${pct === 100 ? '#34D399' : '#A5B4FC'}; padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 700;">
                ${pct}% Mastered
              </span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${steps.map((st) => `
                <label class="reader-step-row">
                  <input type="checkbox" class="reader-step-chk" data-step="${st.key}" ${mastery[st.key] ? 'checked' : ''}>
                  <span style="font-size:${fontSizePx}px;">${st.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="reader-card">
            <div class="reader-section-label">📝 Personal Chapter Notes (Auto-Saved)</div>
            <textarea id="reader-personal-notes" class="form-input" rows="5" placeholder="Write key tricks, doubts, or important page numbers for ${ch.chapterName}..." style="width: 100%; font-size:${fontSizePx - 1}px; margin-top: 6px;">${mastery.notes || ''}</textarea>
          </div>
        `;
      }

      box.innerHTML = `
        <!-- Reader Top Header -->
        <div class="reader-header">
          <div style="min-width: 0; flex: 1;">
            <div style="font-size: 0.72rem; opacity: 0.75; font-weight: 600;">${ch.subject} • Class 10 NCERT • ${pct}% Done</div>
            <h3 style="font-size: 1.05rem; font-weight: 800; margin-top: 2px; word-break: normal; overflow-wrap: break-word;">${nc.title || ch.chapterName}</h3>
            ${nc.titleHi ? `<div style="font-size: 0.76rem; opacity: 0.75;">${nc.titleHi}</div>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <button type="button" class="btn-icon" id="btn-reader-bookmark" title="Bookmark Chapter" style="width: 34px; height: 34px; font-size: 1rem;">
              ${mastery.bookmarked ? '⭐' : '☆'}
            </button>
            <button type="button" class="btn-icon" id="btn-reader-close" title="Close Reader" style="width: 34px; height: 34px;">✕</button>
          </div>
        </div>

        <!-- Reader Customization Bar -->
        <div class="reader-toolbar">
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            <button type="button" class="chip-btn ${this.theme === 'dark' ? 'active' : ''}" data-rtheme="dark" style="font-size: 0.7rem; padding: 4px 8px;">🌙 Dark</button>
            <button type="button" class="chip-btn ${this.theme === 'sepia' ? 'active' : ''}" data-rtheme="sepia" style="font-size: 0.7rem; padding: 4px 8px;">📜 Sepia</button>
            <button type="button" class="chip-btn ${this.theme === 'light' ? 'active' : ''}" data-rtheme="light" style="font-size: 0.7rem; padding: 4px 8px;">☀️ Light</button>
          </div>
          <div style="display: flex; gap: 4px; align-items: center;">
            <button type="button" class="chip-btn" id="btn-reader-font-dec" style="font-size: 0.7rem; padding: 4px 8px;">A-</button>
            <button type="button" class="chip-btn" id="btn-reader-font-inc" style="font-size: 0.7rem; padding: 4px 8px;">A+</button>
            <button type="button" class="btn-primary" id="btn-reader-start-focus" style="font-size: 0.72rem; padding: 5px 10px;">⏱ Focus</button>
          </div>
        </div>

        <!-- 5 Reader Section Tabs -->
        <div class="reader-tabs-bar">
          <button type="button" class="chip-btn ${this.activeTab === 'summary' ? 'active' : ''}" data-rtab="summary">📖 Summary</button>
          <button type="button" class="chip-btn ${this.activeTab === 'formulas' ? 'active' : ''}" data-rtab="formulas">📐 Formulas</button>
          <button type="button" class="chip-btn ${this.activeTab === 'qa' ? 'active' : ''}" data-rtab="qa">📝 Board Q&A</button>
          <button type="button" class="chip-btn ${this.activeTab === 'mcqs' ? 'active' : ''}" data-rtab="mcqs">🎯 MCQs</button>
          <button type="button" class="chip-btn ${this.activeTab === 'mastery' ? 'active' : ''}" data-rtab="mastery">✅ Notes & Tasks</button>
        </div>

        <!-- Scrollable Content -->
        <div class="reader-scroll-body">
          ${tabBodyHtml}
        </div>
      `;

      this.bindEvents();
    },

    bindEvents() {
      const closeBtn = document.getElementById('btn-reader-close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      const bmBtn = document.getElementById('btn-reader-bookmark');
      if (bmBtn && this.currentChapter) {
        bmBtn.addEventListener('click', () => {
          if (window.GuruCompletion) {
            const isBm = window.GuruCompletion.toggleBookmark(this.currentChapter.id);
            if (window.showGuruToast) window.showGuruToast(isBm ? '⭐ Chapter bookmarked!' : 'Bookmark removed');
            this.render();
          }
        });
      }

      document.querySelectorAll('[data-rtheme]').forEach((b) => {
        b.addEventListener('click', () => this.setTheme(b.getAttribute('data-rtheme')));
      });

      const decBtn = document.getElementById('btn-reader-font-dec');
      const incBtn = document.getElementById('btn-reader-font-inc');
      if (decBtn) decBtn.addEventListener('click', () => this.setFontDelta(this.fontDelta - 1));
      if (incBtn) incBtn.addEventListener('click', () => this.setFontDelta(this.fontDelta + 1));

      const focusBtn = document.getElementById('btn-reader-start-focus');
      if (focusBtn && this.currentChapter) {
        focusBtn.addEventListener('click', () => {
          const subj = this.currentChapter.subject || 'Mathematics';
          const title = this.currentChapter.chapterName || this.currentChapter.title || '';
          this.close();
          if (typeof window.startFocusSessionFromCard === 'function') {
            window.startFocusSessionFromCard(subj, 45, title);
          }
        });
      }

      document.querySelectorAll('[data-rtab]').forEach((b) => {
        b.addEventListener('click', () => this.setTab(b.getAttribute('data-rtab')));
      });

      document.querySelectorAll('[data-mcq-q]').forEach((b) => {
        b.addEventListener('click', () => {
          const qIdx = parseInt(b.getAttribute('data-mcq-q'), 10);
          const oIdx = parseInt(b.getAttribute('data-mcq-o'), 10);
          this.mcqState[qIdx] = oIdx;
          this.render();
        });
      });

      document.querySelectorAll('.reader-step-chk').forEach((chk) => {
        chk.addEventListener('change', () => {
          if (window.GuruCompletion && this.currentChapter) {
            window.GuruCompletion.toggleChapterStep(this.currentChapter.id, chk.getAttribute('data-step'), chk.checked);
            this.render();
          }
        });
      });

      const notesArea = document.getElementById('reader-personal-notes');
      if (notesArea && this.currentChapter) {
        notesArea.addEventListener('input', () => {
          if (window.GuruCompletion) {
            window.GuruCompletion.saveChapterNotes(this.currentChapter.id, notesArea.value);
          }
        });
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.GuruChapterReader = ChapterReader;
    window.resolveNcertChapterData = resolveNcertChapterData;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChapterReader, resolveNcertChapterData };
  }
})();
