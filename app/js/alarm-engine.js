/**
 * GuruStudy - Smart Alarm, Web Audio Synthesizer & Voice Announcer Engine (`alarm-engine.js`)
 * Features: Pure Web Audio API Polyphonic Tones (Zero MP3 dependencies) + Web Speech API TTS + Full-Screen Overlay
 * Author: HarshGuruJi (contact@webguruji.online)
 */

class AlarmEngine {
  constructor() {
    this.audioCtx = null;
    this.wakeLock = null;
    this.activeRingingSlot = null;
    this.snoozeCountMap = {}; // slotId -> count (max 2)
    this.alarmTimers = [];
    this.soundTones = ['Morning Bell', 'Digital Pulse', 'Temple Chime', 'Soft Piano'];
    this.currentTone = 'Morning Bell';
    this.voiceLang = 'en-IN'; // 'en-IN', 'hi-IN', 'chime-only'
    this.isPlayingAlarm = false;
    this.alarmInterval = null;

    this.initAudioContext();
  }

  initAudioContext() {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported on this platform', e);
    }
  }

  ensureAudioReady() {
    if (!this.audioCtx) {
      this.initAudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // ----------------------------------------------------------------------------
  // WEB AUDIO API POLYPHONIC SOUND SYNTHESIZER (0 MP3 DEPENDENCIES)
  // ----------------------------------------------------------------------------
  playTone(toneName = 'Morning Bell', durationSeconds = 3) {
    this.ensureAudioReady();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    switch (toneName) {
      case 'Morning Bell':
        // Harmonious bell using two sine waves with harmonic ratios and exponential decay
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.15 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 1.8);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.15);
          osc.stop(now + idx * 0.15 + 2.0);
        });
        break;

      case 'Digital Pulse':
        // Modern tech pulse chime
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now + i * 0.25);
          
          gain.gain.setValueAtTime(0.12, now + i * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.25);
          osc.stop(now + i * 0.25 + 0.2);
        }
        break;

      case 'Temple Chime':
        // Deep resonating Tibetan bowl / temple gong chime
        [220, 440, 660, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.3 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 3.2);
        });
        break;

      case 'Soft Piano':
      default:
        // Soft electric piano chord (C Major 7: C4, E4, G4, B4)
        [261.63, 329.63, 392.00, 493.88].forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 2.5);
        });
        break;
    }
  }

  // ----------------------------------------------------------------------------
  // SPEECH SYNTHESIS VOICE ANNOUNCER (HINDI & ENGLISH)
  // ----------------------------------------------------------------------------
  speakVoice(message, langCode = 'en-IN') {
    if (this.voiceLang === 'chime-only') return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // cancel previous speech
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95; // slightly slower, clear educational pace
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (langCode.startsWith('hi')) {
      selectedVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
      utterance.lang = 'hi-IN';
    } else {
      selectedVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india') || v.lang.includes('en-GB') || v.lang.includes('en'));
      utterance.lang = 'en-IN';
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // ----------------------------------------------------------------------------
  // ALARM RINGING & FULL-SCREEN MODAL LOGIC
  // ----------------------------------------------------------------------------
  triggerAlarm(slot, studentName = 'Student', isPreWarning = false) {
    this.activeRingingSlot = slot;

    // 1. Mobile Vibration pattern
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 800]);
    }

    // 2. Continuous Ringing Loop until dismissed
    this.isPlayingAlarm = true;
    this.playTone(this.currentTone);
    if (this.alarmInterval) clearInterval(this.alarmInterval);
    this.alarmInterval = setInterval(() => {
      if (this.isPlayingAlarm) {
        this.playTone(this.currentTone);
      }
    }, 4000);

    // 3. Motivational Voice Alert
    let voiceMessage = '';
    if (isPreWarning) {
      voiceMessage = (this.voiceLang === 'hi-IN')
        ? `नमस्ते ${studentName}! 5 मिनट में आपकी ${slot.subject} की पढ़ाई शुरू होने वाली है। अपनी NCERT किताब तैयार रखें।`
        : `Attention ${studentName}! Your ${slot.subject} session begins in 5 minutes. Get your NCERT book and notes ready!`;
    } else {
      voiceMessage = (this.voiceLang === 'hi-IN')
        ? `समय हो गया ${studentName}! कक्षा 10 ${slot.subject} का अध्ययन शुरू करें। लक्ष्य 95 प्रतिशत बोर्ड परीक्षा!`
        : `Hello ${studentName}! It's time for ${slot.subject}. Target duration: ${slot.durationMinutes} minutes. Let's conquer NCERT today!`;
    }
    
    setTimeout(() => {
      this.speakVoice(voiceMessage, this.voiceLang);
    }, 800);

    // 4. System Notification
    this.showSystemNotification(slot, isPreWarning);

    // 5. Native Android Bridge trigger if running inside APK
    if (window.AndroidAlarm && typeof window.AndroidAlarm.triggerRingingAlarm === 'function') {
      window.AndroidAlarm.triggerRingingAlarm(JSON.stringify(slot));
    }

    // 6. Display Fullscreen UI Overlay
    this.showFullscreenAlarmModal(slot, isPreWarning);
  }

  stopAlarm() {
    this.isPlayingAlarm = false;
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.hideFullscreenAlarmModal();
  }

  snoozeAlarm(slotId) {
    this.stopAlarm();
    const count = this.snoozeCountMap[slotId] || 0;
    if (count >= 2) {
      alert('Maximum 2 snoozes allowed! Board exam discipline requires timely study.');
      return;
    }
    this.snoozeCountMap[slotId] = count + 1;

    // Schedule 5 min snooze
    setTimeout(() => {
      if (this.activeRingingSlot && this.activeRingingSlot.id === slotId) {
        this.triggerAlarm(this.activeRingingSlot, 'Student', false);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // ----------------------------------------------------------------------------
  // FULLSCREEN ALARM MODAL DOM MANIPULATION
  // ----------------------------------------------------------------------------
  showFullscreenAlarmModal(slot, isPreWarning = false) {
    let modal = document.getElementById('guru-alarm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'guru-alarm-modal';
      modal.className = 'guru-alarm-overlay';
      document.body.appendChild(modal);
    }

    const snoozesLeft = 2 - (this.snoozeCountMap[slot.id] || 0);

    modal.innerHTML = `
      <div class="alarm-card-glow">
        <div class="alarm-pulsing-badge">⏰ ${isPreWarning ? '5 MIN WARNING' : 'STUDY ALARM RINGING'}</div>
        <div class="alarm-subject-title" style="color: ${slot.color || '#3B82F6'};">${slot.subject}</div>
        <div class="alarm-duration-pill">${slot.durationMinutes} Minutes Focus Session</div>
        <div class="alarm-chapter-name">${slot.assignedChapter || slot.focusGoal || 'NCERT Class 10 Board Preparation'}</div>
        
        <div class="alarm-actions">
          <button id="btn-alarm-start" class="btn-alarm-primary">
            🚀 Start Studying Now
          </button>
          <button id="btn-alarm-snooze" class="btn-alarm-secondary" ${snoozesLeft <= 0 ? 'disabled' : ''}>
            💤 Snooze 5 Mins (${snoozesLeft} Left)
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');

    document.getElementById('btn-alarm-start')?.addEventListener('click', () => {
      this.stopAlarm();
      if (typeof window.guruLaunchFocusSession === 'function') {
        window.guruLaunchFocusSession(slot);
      }
    });

    document.getElementById('btn-alarm-snooze')?.addEventListener('click', () => {
      this.snoozeAlarm(slot.id);
    });
  }

  hideFullscreenAlarmModal() {
    const modal = document.getElementById('guru-alarm-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // ----------------------------------------------------------------------------
  // SYSTEM NOTIFICATIONS & WAKE LOCK
  // ----------------------------------------------------------------------------
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  showSystemNotification(slot, isPreWarning) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = isPreWarning 
        ? `⚠️ 5 Mins Left: ${slot.subject} Study Session` 
        : `⏰ Time for ${slot.subject} (${slot.durationMinutes}m)`;
      
      const body = slot.assignedChapter || slot.focusGoal || 'Class 10 CBSE 88-Day Study Mission';

      try {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [300, 100, 300],
          requireInteraction: true
        });
      } catch (err) {
        console.warn('Notification creation error', err);
      }
    }
  }

  async toggleWakeLock(enable = true) {
    if ('wakeLock' in navigator) {
      try {
        if (enable && !this.wakeLock) {
          this.wakeLock = await navigator.wakeLock.request('screen');
          this.wakeLock.addEventListener('release', () => {
            this.wakeLock = null;
          });
          return true;
        } else if (!enable && this.wakeLock) {
          await this.wakeLock.release();
          this.wakeLock = null;
          return false;
        }
      } catch (err) {
        console.warn('Wake Lock request error', err);
        return false;
      }
    }
    return false;
  }

  // ----------------------------------------------------------------------------
  // PERSISTED ALARM CONFIG & TIME PARSING (Web App Android Parity)
  // ----------------------------------------------------------------------------
  getConfigKey() {
    return 'gurustudy_alarm_config_v1';
  }

  loadConfig() {
    const defaults = {
      masterEnabled: true,
      dailyStartTime: '16:00',
      ringtone: 'Morning Bell',
      voiceEnabled: true,
      voiceLang: 'en-IN',
      preWarningEnabled: true,
      slotOverrides: {} // { '0': { enabled: true, time: '16:00' }, ... }
    };
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(this.getConfigKey());
        if (raw) {
          const parsed = JSON.parse(raw);
          const merged = { ...defaults, ...parsed, slotOverrides: parsed.slotOverrides || {} };
          this.currentTone = merged.ringtone || 'Morning Bell';
          this.voiceLang = merged.voiceEnabled ? (merged.voiceLang || 'en-IN') : 'chime-only';
          return merged;
        }
      }
    } catch (_) {}
    return defaults;
  }

  saveConfig(patch) {
    const cur = this.loadConfig();
    const next = {
      ...cur,
      ...(patch || {}),
      slotOverrides: {
        ...cur.slotOverrides,
        ...((patch && patch.slotOverrides) || {})
      }
    };
    this.currentTone = next.ringtone || 'Morning Bell';
    this.voiceLang = next.voiceEnabled ? (next.voiceLang || 'en-IN') : 'chime-only';
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.getConfigKey(), JSON.stringify(next));
      }
    } catch (_) {}
    return next;
  }

  parseTimeToMinutes(timeStr) {
    if (!timeStr) return null;
    const str = String(timeStr).trim().toUpperCase();
    const match = str.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const mer = match[3];
    if (mer === 'PM' && h < 12) h += 12;
    if (mer === 'AM' && h === 12) h = 0;
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  }

  minutesTo24h(totalMins) {
    const wrapped = ((totalMins % 1440) + 1440) % 1440;
    const h = Math.floor(wrapped / 60);
    const m = wrapped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  getEffectiveSlots(todaySchedule) {
    const cfg = this.loadConfig();
    const rawSlots = (todaySchedule && (todaySchedule.schedule || todaySchedule.slots)) || [];
    const baseStartMins = this.parseTimeToMinutes(cfg.dailyStartTime);
    let cursorMins = baseStartMins !== null ? baseStartMins : 16 * 60;

    return rawSlots.map((slot, idx) => {
      const dur = parseInt(slot.durationMinutes, 10) || 60;
      const computed24 = this.minutesTo24h(cursorMins);
      cursorMins += dur + 10; // 10-min refresh break between blocks

      const override = cfg.slotOverrides[String(idx)] || {};
      const finalTime24 = override.time || computed24;
      const enabled = typeof override.enabled === 'boolean' ? override.enabled : true;

      return {
        ...slot,
        slotIndex: idx,
        alarmTime24: finalTime24,
        alarmEnabled: cfg.masterEnabled && enabled
      };
    });
  }

  getArmedCount() {
    return this.armedSlotCount || 0;
  }

  // ----------------------------------------------------------------------------
  // AUTOMATIC TIMETABLE MONITORING & ALARM ARMING
  // ----------------------------------------------------------------------------
  armTodayAlarms(todaySchedule, studentName = 'Student') {
    this.alarmTimers.forEach(t => clearTimeout(t));
    this.alarmTimers = [];
    this.armedSlotCount = 0;

    const cfg = this.loadConfig();
    if (!cfg.masterEnabled || !todaySchedule) return 0;

    const effectiveSlots = this.getEffectiveSlots(todaySchedule);
    if (!effectiveSlots.length) return 0;

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const currentSecs = now.getSeconds();

    effectiveSlots.forEach(slot => {
      if (!slot.alarmEnabled) return;
      const targetSlotMins = this.parseTimeToMinutes(slot.alarmTime24);
      if (targetSlotMins === null) return;

      const diffMs = ((targetSlotMins - currentMins) * 60 - currentSecs) * 1000;
      if (diffMs > 0) {
        this.armedSlotCount++;
        const timerId = setTimeout(() => {
          this.triggerAlarm(slot, studentName, false);
        }, diffMs);
        this.alarmTimers.push(timerId);
      }

      if (cfg.preWarningEnabled) {
        const warningDiffMs = diffMs - (5 * 60 * 1000);
        if (warningDiffMs > 0) {
          const warnTimerId = setTimeout(() => {
            this.triggerAlarm(slot, studentName, true);
          }, warningDiffMs);
          this.alarmTimers.push(warnTimerId);
        }
      }
    });

    return this.armedSlotCount;
  }
}

// Global instance
const guruAlarms = new AlarmEngine();
if (typeof window !== 'undefined') {
  window.guruAlarms = guruAlarms;
  window.GuruAlarm = guruAlarms;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AlarmEngine, guruAlarms };
}
