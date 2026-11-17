/**
 * GuruStudy - YouTube Video Launcher & Intent Manager (`youtube-launcher.js`)
 * Reliable lecture launching across Android APK, Mobile Chrome, and Desktop browsers.
 * Author: HarshGuruJi (contact@webguruji.online)
 */

(function () {
  'use strict';

  function showToast(message, actionLabel, onAction, durationMs = 4500) {
    let container = document.getElementById('gurustudy-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gurustudy-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
        width: min(92vw, 420px);
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'guru-toast-pill';
    toast.style.cssText = `
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.35);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #FFFFFF;
      padding: 10px 16px;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      pointer-events: auto;
      animation: guruSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      white-space: normal;
      word-break: break-word;
    `;

    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toast.appendChild(textSpan);

    if (actionLabel && typeof onAction === 'function') {
      const actionBtn = document.createElement('button');
      actionBtn.textContent = actionLabel;
      actionBtn.style.cssText = `
        background: #6366F1;
        color: #FFFFFF;
        border: none;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        flex-shrink: 0;
        white-space: nowrap;
      `;
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onAction();
        toast.remove();
      });
      toast.appendChild(actionBtn);
    }

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, durationMs);
  }

  function openChapterVideo(chapterId, videoIndex = 0, directUrl = '') {
    // 1. Haptic feedback
    try {
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    } catch (_) {}

    // 2. Resolve video details
    let teacherName = 'Teacher';
    let targetUrl = directUrl;

    if (!targetUrl && window.getChapterTeacherVideos) {
      const videos = window.getChapterTeacherVideos(chapterId);
      if (videos && videos.length > 0) {
        const vid = videos[videoIndex] || videos[0];
        targetUrl = vid.youtubeUrl || vid.searchFallbackUrl;
        teacherName = vid.teacherName || 'Top Teacher';
      }
    }

    if (!targetUrl) {
      targetUrl = `https://www.youtube.com/results?search_query=Class+10+CBSE+NCERT+${encodeURIComponent(chapterId)}+One+Shot`;
    }

    // 3. Offline check (Android App Prompt 10)
    if (!navigator.onLine) {
      showToast(`⚠️ You're offline — connect to internet to watch ${teacherName}'s lecture.`);
      return;
    }

    // 4. Mark video watched in store / database
    try {
      if (window.GuruStore && typeof window.GuruStore.setState === 'function') {
        const currentProgress = window.GuruStore.getState().syllabusProgress || {};
        const chKey = String(chapterId);
        const existing = currentProgress[chKey] || {};
        window.GuruStore.setState({
          syllabusProgress: {
            ...currentProgress,
            [chKey]: {
              ...existing,
              videoWatched: true
            }
          }
        });
      } else if (window.guruDB && typeof window.guruDB.markChapterProgress === 'function') {
        window.guruDB.markChapterProgress(chapterId, 'videoWatched', true);
      }
    } catch (e) {
      console.warn('[YouTubeLauncher] Failed to update progress:', e);
    }

    // 5. Offer 45m study log toast
    showToast(
      `Opening ${teacherName}'s lecture! Log 45 mins to today's study goal?`,
      '+45m',
      () => {
        try {
          if (window.GuruStore) {
            window.GuruStore.addStudyMinutes(45, 'video');
            showToast('✓ 45 mins logged to your daily study mission!');
          }
        } catch (_) {}
      }
    );

    // 6. Launch YouTube URL
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (isMobile) {
      // Direct navigation allows Android Intent system to intercept and launch YouTube native app
      window.location.href = targetUrl;
    } else {
      // Desktop: Open clean popout tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Global event delegation for all YouTube buttons
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-yt-url], .yt-teacher-btn, [data-chapter-video]');
      if (!btn) return;

      // Prevent accordion toggling or parent collapse
      e.stopPropagation();

      const chapterId = btn.getAttribute('data-chapter-id') || btn.getAttribute('data-chapter') || '';
      const videoIndex = parseInt(btn.getAttribute('data-video-idx') || '0', 10);
      const directUrl = btn.getAttribute('data-yt-url') || '';

      openChapterVideo(chapterId, videoIndex, directUrl);
    });
  }

  // Expose to window
  if (typeof window !== 'undefined') {
    window.openChapterVideo = openChapterVideo;
    window.showGuruToast = showToast;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { openChapterVideo, showToast };
  }
})();
