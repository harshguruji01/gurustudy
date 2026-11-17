/**
 * GuruStudy - Distraction-Free Focus Timer & Progress Engine (Phase 5)
 * URL: https://gurustudy.webguruji.online
 *
 * Implements:
 * - Dual timer modes: Target Session Mode & Smart Pomodoro (50m Focus + 10m Break)
 * - Drift-free timestamp delta ticker (Date.now()) resistant to background throttling
 * - Synthesized Web Audio Ambient Sound Generator (Soft Rain & White Noise)
 * - Live per-minute progress saving into GuruDB (offline-first)
 * - Immersive Full-Screen Study Desk mode with Screen WakeLock indicator
 * - Victory Chime & Canvas Confetti celebratory completion modal
 * - NCERT checklist & confidence rating recorder
 * - Manual catch-up logging for coaching/school study hours
 */

class FocusTimerEngine {
  constructor() {
    this.currentSubject = 'Mathematics';
    this.targetDurationMinutes = 120;
    this.totalSeconds = 120 * 60;
    this.remainingSeconds = 120 * 60;
    this.mode = 'target'; // 'target' or 'pomodoro'
    this.pomodoroStage = 'focus'; // 'focus' (50m) or 'break' (10m)
    this.pomodoroFocusSeconds = 50 * 60;
    this.pomodoroBreakSeconds = 10 * 60;

    this.isRunning = false;
    this.isPaused = false;
    this.startTime = null;
    this.timerInterval = null;
    this.elapsedSecondsInSession = 0;
    this.lastSavedMinute = 0;

    this.chapterGoal = '';
    this.currentDateStr = new Date().toISOString().split('T')[0];

    // Audio & Ambient synthesis
    this.audioCtx = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.ambientType = 'none'; // 'none', 'rain', 'whitenoise'

    // Wake lock
    this.wakeLock = null;

    // Callbacks for UI updates
    this.onTick = null;
    this.onComplete = null;
    this.onModeChange = null;

    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.audioCtx = new AudioContextClass();
    }
  }

  ensureAudioResumed() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Configure and load a study session
   * @param {string} subject - e.g. 'Mathematics', 'Science', 'Social Science', 'Language', 'Artificial Intelligence'
   * @param {number} durationMinutes - e.g. 120, 90, 60, 30
   * @param {string} chapterGoal - Target chapter title
   * @param {string} mode - 'target' or 'pomodoro'
   */
  loadSession(subject, durationMinutes, chapterGoal = '', mode = 'target') {
    this.pause();
    this.currentSubject = subject || 'Mathematics';
    this.targetDurationMinutes = durationMinutes || 120;
    this.chapterGoal = chapterGoal || '';
    this.mode = mode || 'target';

    if (this.mode === 'pomodoro') {
      this.pomodoroStage = 'focus';
      this.totalSeconds = this.pomodoroFocusSeconds;
      this.remainingSeconds = this.pomodoroFocusSeconds;
    } else {
      this.totalSeconds = this.targetDurationMinutes * 60;
      this.remainingSeconds = this.totalSeconds;
    }

    this.elapsedSecondsInSession = 0;
    this.lastSavedMinute = 0;
    this.isPaused = false;
    this.isRunning = false;

    if (this.onTick) {
      this.onTick(this.getState());
    }
  }

  setMode(mode) {
    if (mode !== 'target' && mode !== 'pomodoro') return;
    const wasRunning = this.isRunning;
    this.pause();
    this.mode = mode;

    if (mode === 'pomodoro') {
      this.pomodoroStage = 'focus';
      this.totalSeconds = this.pomodoroFocusSeconds;
      this.remainingSeconds = this.pomodoroFocusSeconds;
    } else {
      this.totalSeconds = this.targetDurationMinutes * 60;
      this.remainingSeconds = this.totalSeconds;
    }

    if (this.onModeChange) this.onModeChange(this.mode);
    if (this.onTick) this.onTick(this.getState());

    if (wasRunning) {
      this.start();
    }
  }

  /**
   * Start or resume the timer with drift-free delta calculation
   */
  start() {
    this.ensureAudioResumed();
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.requestWakeLock();

    const expectedEndTime = Date.now() + (this.remainingSeconds * 1000);

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      const now = Date.now();
      const diffMs = expectedEndTime - now;
      const leftSec = Math.max(0, Math.ceil(diffMs / 1000));

      this.remainingSeconds = leftSec;
      this.elapsedSecondsInSession++;

      // Log progress to DB every 60 seconds of actual study
      const completedMinutesNow = Math.floor(this.elapsedSecondsInSession / 60);
      if (completedMinutesNow > this.lastSavedMinute && this.pomodoroStage !== 'break') {
        const deltaMins = completedMinutesNow - this.lastSavedMinute;
        this.saveLiveProgress(deltaMins);
        this.lastSavedMinute = completedMinutesNow;
      }

      if (this.onTick) {
        this.onTick(this.getState());
      }

      if (this.remainingSeconds <= 0) {
        this.handleTimerEnd();
      }
    }, 500); // 500ms heartbeat prevents fractional drop
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.timerInterval);
    this.releaseWakeLock();
    if (this.onTick) this.onTick(this.getState());
  }

  reset() {
    this.pause();
    this.isPaused = false;
    this.loadSession(this.currentSubject, this.targetDurationMinutes, this.chapterGoal, this.mode);
  }

  handleTimerEnd() {
    this.pause();
    this.playVictoryChime();

    if (this.mode === 'pomodoro') {
      if (this.pomodoroStage === 'focus') {
        // Switch to Pomodoro Break
        this.pomodoroStage = 'break';
        this.totalSeconds = this.pomodoroBreakSeconds;
        this.remainingSeconds = this.pomodoroBreakSeconds;
        this.notifyUser('Pomodoro Focus Complete! 10-Minute Break Started.', 'Great job! Rest your eyes, stretch and hydrate.');
        this.start();
        return;
      } else {
        // Break ended, back to focus
        this.pomodoroStage = 'focus';
        this.totalSeconds = this.pomodoroFocusSeconds;
        this.remainingSeconds = this.pomodoroFocusSeconds;
        this.notifyUser('Break Over! Time to Focus.', 'Back to ' + this.currentSubject + ' study session.');
        if (this.onTick) this.onTick(this.getState());
        return;
      }
    }

    // Target Session Complete!
    if (this.onComplete) {
      this.onComplete({
        subject: this.currentSubject,
        durationMinutes: this.targetDurationMinutes,
        chapterGoal: this.chapterGoal,
        minutesStudied: Math.round(this.elapsedSecondsInSession / 60)
      });
    }
  }

  /**
   * Saves incrementally completed minutes to GuruDB
   */
  async saveLiveProgress(deltaMins) {
    if (typeof GuruDB === 'undefined' || !deltaMins || deltaMins <= 0) return;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const log = await GuruDB.getDailyLog(todayStr);

      const subjectKey = this.getSubjectProgressKey(this.currentSubject);
      if (subjectKey) {
        log[subjectKey] = (log[subjectKey] || 0) + deltaMins;
        log.total_minutes = (log.total_minutes || 0) + deltaMins;
        log.synced = false;
        await GuruDB.saveDailyLog(log);

        // Dispatch global event for live dashboard ring update
        window.dispatchEvent(new CustomEvent('gurustudy:progress-updated', {
          detail: { log, subject: this.currentSubject, addedMinutes: deltaMins }
        }));
      }
    } catch (e) {
      console.warn('[FocusTimer] Failed to save live minute progress:', e);
    }
  }

  /**
   * Allow manual catch up study time
   */
  async logManualMinutes(subject, minutes, notes = '') {
    if (typeof GuruDB === 'undefined' || !minutes || minutes <= 0) return false;
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const log = await GuruDB.getDailyLog(todayStr);
      const subjectKey = this.getSubjectProgressKey(subject);

      if (subjectKey) {
        log[subjectKey] = (log[subjectKey] || 0) + Number(minutes);
        log.total_minutes = (log.total_minutes || 0) + Number(minutes);
        log.synced = false;
        await GuruDB.saveDailyLog(log);

        window.dispatchEvent(new CustomEvent('gurustudy:progress-updated', {
          detail: { log, subject, addedMinutes: Number(minutes) }
        }));
        return true;
      }
    } catch (err) {
      console.error('[FocusTimer] Manual log error:', err);
      return false;
    }
    return false;
  }

  getSubjectProgressKey(subject) {
    const s = (subject || '').toLowerCase();
    if (s.includes('math')) return 'maths_minutes';
    if (s.includes('scien')) return 'science_minutes';
    if (s.includes('social') || s.includes('sst')) return 'sst_minutes';
    if (s.includes('eng') || s.includes('hin') || s.includes('lang')) return 'language_minutes';
    if (s.includes('ai') || s.includes('intell') || s.includes('417')) return 'ai_minutes';
    return 'maths_minutes';
  }

  getState() {
    const progressPercent = this.totalSeconds > 0
      ? Math.min(100, Math.max(0, ((this.totalSeconds - this.remainingSeconds) / this.totalSeconds) * 100))
      : 0;

    return {
      subject: this.currentSubject,
      targetDurationMinutes: this.targetDurationMinutes,
      totalSeconds: this.totalSeconds,
      remainingSeconds: this.remainingSeconds,
      formattedRemaining: this.formatTime(this.remainingSeconds),
      progressPercent: Math.round(progressPercent * 10) / 10,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      mode: this.mode,
      pomodoroStage: this.pomodoroStage,
      chapterGoal: this.chapterGoal,
      ambientType: this.ambientType,
      wakeLockActive: !!this.wakeLock
    };
  }

  formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /* ---------------- Ambient Sound Synthesis (Pure Web Audio) ---------------- */

  setAmbientSound(type) {
    this.ensureAudioResumed();
    this.stopAmbientSound();
    this.ambientType = type;

    if (!this.audioCtx || type === 'none') return;

    if (type === 'rain') {
      this.startRainSound();
    } else if (type === 'whitenoise') {
      this.startWhiteNoiseSound();
    }
  }

  stopAmbientSound() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (e) {}
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch (e) {}
      this.ambientGain = null;
    }
    this.ambientType = 'none';
  }

  startRainSound() {
    if (!this.audioCtx) return;
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise / brown noise approximation for gentle rainfall
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    whiteNoise.start();
    this.ambientSource = whiteNoise;
    this.ambientGain = gain;
  }

  startWhiteNoiseSound() {
    if (!this.audioCtx) return;
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);

    whiteNoise.connect(gain);
    gain.connect(this.audioCtx.destination);

    whiteNoise.start();
    this.ambientSource = whiteNoise;
    this.ambientGain = gain;
  }

  playVictoryChime() {
    if (!this.audioCtx) return;
    this.ensureAudioResumed();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const startTime = this.audioCtx.currentTime + (idx * 0.15);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.95);
    });
  }

  /* ---------------- Wake Lock API ---------------- */

  async requestWakeLock() {
    if ('wakeLock' in navigator) {
      try {
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          this.wakeLock = null;
        });
      } catch (err) {
        console.log('[FocusTimer] Screen WakeLock unavailable:', err.message);
      }
    }
  }

  releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().then(() => {
        this.wakeLock = null;
      }).catch(() => {});
    }
  }

  notifyUser(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          vibrate: [200, 100, 200]
        });
      } catch (e) {}
    }
  }
}

// Global Singleton Instance
window.GuruFocusTimer = new FocusTimerEngine();
