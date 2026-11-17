/**
 * GuruStudy - Video Lectures, In-App Player & Notes Manager (Phases 12, 13, 14, 15)
 * URL: https://gurustuji.webguruji.online
 */

class GuruVideoManager {
  constructor() {
    this.watchedKey = 'gurustudy_watched_videos';
    this.bookmarksKey = 'gurustudy_bookmarked_videos';
    this.notesKey = 'gurustudy_chapter_notes';
    this.currentPlayingVideo = null;
    this.currentChapterId = null;

    this.watchedVideos = this.loadJSON(this.watchedKey, {});
    this.bookmarkedVideos = this.loadJSON(this.bookmarksKey, {});
    this.chapterNotes = this.loadJSON(this.notesKey, {});

    this.currentFilterTag = 'all';
    this.currentMedium = 'Hinglish';
  }

  loadJSON(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  saveJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('[VideoManager] Save error:', e);
    }
  }

  isWatched(videoId) {
    return !!this.watchedVideos[videoId];
  }

  toggleWatched(videoId, chapterId, durationMinutes = 45) {
    if (this.watchedVideos[videoId]) {
      delete this.watchedVideos[videoId];
    } else {
      this.watchedVideos[videoId] = {
        chapterId,
        watchedAt: new Date().toISOString(),
        durationMinutes
      };
    }
    this.saveJSON(this.watchedKey, this.watchedVideos);
    this.syncToSupabase(videoId, chapterId);
    return this.isWatched(videoId);
  }

  isBookmarked(videoId) {
    return !!this.bookmarkedVideos[videoId];
  }

  toggleBookmark(videoObj, chapterId) {
    const vId = videoObj.id || videoObj.videoId;
    if (this.bookmarkedVideos[vId]) {
      delete this.bookmarkedVideos[vId];
    } else {
      this.bookmarkedVideos[vId] = {
        ...videoObj,
        chapterId,
        bookmarkedAt: new Date().toISOString()
      };
    }
    this.saveJSON(this.bookmarksKey, this.bookmarkedVideos);
    return this.isBookmarked(vId);
  }

  getSundayRevisionQueue() {
    return Object.values(this.bookmarkedVideos);
  }

  getChapterNotes(chapterId) {
    return this.chapterNotes[chapterId] || '';
  }

  saveChapterNotes(chapterId, text) {
    this.chapterNotes[chapterId] = text;
    this.saveJSON(this.notesKey, this.chapterNotes);
  }

  async syncToSupabase(videoId, chapterId) {
    if (typeof GuruDB !== 'undefined' && GuruDB.supabase) {
      try {
        const user = (await GuruDB.supabase.auth.getUser())?.data?.user;
        if (user) {
          await GuruDB.supabase.from('user_video_progress').upsert({
            user_id: user.id,
            chapter_id: chapterId,
            video_id: videoId,
            watched_at: new Date().toISOString(),
            notes: this.getChapterNotes(chapterId)
          });
        }
      } catch (err) {
        console.log('[VideoManager] Cloud sync queued offline:', err.message);
      }
    }
  }

  /**
   * Open the in-app distraction-free modal player
   */
  openPlayer(video, chapterId, chapterName, subject) {
    this.currentPlayingVideo = video;
    this.currentChapterId = chapterId;

    // Auto pause ambient and alarm audio to avoid overlap
    if (window.GuruFocusTimer) {
      window.GuruFocusTimer.stopAmbientSound();
    }
    if (window.GuruAlarmEngine) {
      window.GuruAlarmEngine.stopAlarmSound();
    }

    const modal = document.getElementById('modal-video-player');
    const iframe = document.getElementById('video-player-iframe');
    const offlineNotice = document.getElementById('video-offline-notice');
    const titleEl = document.getElementById('video-player-title');
    const badgeEl = document.getElementById('video-player-badge');
    const notesInput = document.getElementById('video-quick-notes');

    titleEl.textContent = video.title;
    badgeEl.textContent = `${subject} • ${chapterName}`;
    notesInput.value = this.getChapterNotes(chapterId);

    // Network check
    if (!navigator.onLine) {
      iframe.style.display = 'none';
      offlineNotice.style.display = 'block';
    } else {
      offlineNotice.style.display = 'none';
      iframe.style.display = 'block';
      const embedUrl = video.embedUrl || GURUSTUDY_LECTURES.buildEmbedUrl(video.videoId, video.searchQuery);
      iframe.src = embedUrl;
    }

    this.updateWatchedButtonUI();
    modal.classList.add('active');
  }

  closePlayer() {
    const modal = document.getElementById('modal-video-player');
    const iframe = document.getElementById('video-player-iframe');
    if (iframe) iframe.src = 'about:blank';
    modal.classList.remove('active');
    this.currentPlayingVideo = null;
  }

  updateWatchedButtonUI() {
    const btn = document.getElementById('btn-player-mark-watched');
    if (!btn || !this.currentPlayingVideo) return;
    const vId = this.currentPlayingVideo.id || this.currentPlayingVideo.videoId;
    if (this.isWatched(vId)) {
      btn.textContent = '✓ Watched (Marked)';
      btn.style.background = '#059669';
    } else {
      btn.textContent = 'Mark Lecture Completed (+20%)';
      btn.style.background = '#6366F1';
    }
  }

  /**
   * Add video lecture duration to today's study target
   */
  async addVideoTimeToToday(minutes = 45) {
    if (!this.currentPlayingVideo) return;
    const subj = this.currentPlayingVideo.subject || 'Mathematics';
    if (window.GuruFocusTimer) {
      await window.GuruFocusTimer.logManualMinutes(subj, minutes, `Video Lecture: ${this.currentPlayingVideo.title}`);
      alert(`🎉 Added ${minutes} minutes of Video Study to today's ${subj} target!`);
    }
  }
}

// Global Singleton Instance
window.GuruVideoManager = new GuruVideoManager();
