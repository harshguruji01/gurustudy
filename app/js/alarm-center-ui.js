/**
 * GuruStudy - Interactive Alarm Center & Setup Controller (`alarm-center-ui.js`)
 * URL: https://gurustudy.webguruji.online/app/
 *
 * Brings Android AlarmCenterScreen capabilities to the Web App:
 * - Master Study Alarms switch + Armed Count indicator
 * - Daily Start Time customizer (auto-recalculates Mon–Sat 5h & Sunday 6.5h+AI slots)
 * - Per-slot custom alarm time (<input type="time">) & individual ON/OFF toggles
 * - Web Audio Ringtone picker + instant Preview button
 * - Voice announcement toggle + English / Hinglish (Hindi) language picker
 * - Quick 5-Second Live Test Alarm button
 * - Native Browser Notification permission button
 *
 * Author: HarshGuruJi (contact@webguruji.online)
 */

(function () {
  'use strict';

  const AlarmCenterUI = {
    testCountdownTimer: null,

    open() {
      const modal = document.getElementById('modal-alarm-center');
      if (!modal) return;
      this.render();
      modal.classList.add('active');
    },

    close() {
      const modal = document.getElementById('modal-alarm-center');
      if (modal) modal.classList.remove('active');
    },

    getTodaySchedule() {
      if (typeof GuruTimetable !== 'undefined' && typeof GuruTimetable.getDaySchedule === 'function') {
        return GuruTimetable.getDaySchedule(new Date());
      }
      return { schedule: [], isSunday: false };
    },

    rearmNow() {
      if (typeof guruAlarms === 'undefined') return 0;
      const sched = this.getTodaySchedule();
      let name = 'Student';
      try {
        const prof = window.GuruStore ? window.GuruStore.getState().profile : null;
        name = (prof && (prof.name || prof.fullName)) || 'Student';
      } catch (_) {}
      return guruAlarms.armTodayAlarms(sched, name);
    },

    render() {
      const container = document.getElementById('alarm-center-body');
      if (!container || typeof guruAlarms === 'undefined') return;

      const cfg = guruAlarms.loadConfig();
      const sched = this.getTodaySchedule();
      const slots = guruAlarms.getEffectiveSlots(sched);
      const armedCount = this.rearmNow();

      const notifSupported = typeof Notification !== 'undefined';
      const notifStatus = notifSupported ? Notification.permission : 'unsupported';
      const notifBadgeColor = notifStatus === 'granted' ? '#10B981' : (notifStatus === 'denied' ? '#EF4444' : '#F59E0B');
      const notifLabel = notifStatus === 'granted' ? '✓ Allowed' : (notifStatus === 'denied' ? 'Blocked' : 'Not Enabled');

      const tonesHtml = guruAlarms.soundTones
        .map((tone) => `<option value="${tone}" ${cfg.ringtone === tone ? 'selected' : ''}>${tone}</option>`)
        .join('');

      const slotsHtml = slots
        .map((slot, idx) => `
          <div class="alarm-slot-row" data-slot-idx="${idx}">
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.86rem; font-weight: 700; color: #FFFFFF;">${slot.subject}</div>
              <div style="font-size: 0.72rem; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${slot.chapter || ''} • ${slot.durationMinutes}m</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
              <input type="time" class="form-input alarm-slot-time-input" data-slot-idx="${idx}" value="${slot.alarmTime24}" style="width: 112px; padding: 6px 8px; font-size: 0.8rem;" ${!cfg.masterEnabled ? 'disabled' : ''}>
              <label class="alarm-toggle-wrap" title="Enable/Disable Alarm">
                <input type="checkbox" class="alarm-slot-toggle" data-slot-idx="${idx}" ${slot.alarmEnabled ? 'checked' : ''} ${!cfg.masterEnabled ? 'disabled' : ''}>
                <span class="alarm-toggle-slider"></span>
              </label>
            </div>
          </div>
        `)
        .join('');

      container.innerHTML = `
        <!-- Status & Master Switch -->
        <div class="alarm-section-card" style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div style="min-width: 0;">
            <div style="font-size: 0.92rem; font-weight: 800; color: #FFFFFF;">🔔 Study Timetable Alarms</div>
            <div style="font-size: 0.74rem; color: ${cfg.masterEnabled ? '#34D399' : '#94A3B8'}; margin-top: 2px;" id="alarm-armed-status-text">
              ${cfg.masterEnabled ? `✓ ${armedCount} Upcoming Alarm(s) Armed Today` : 'Alarms Paused'}
            </div>
          </div>
          <label class="alarm-toggle-wrap">
            <input type="checkbox" id="alarm-master-toggle" ${cfg.masterEnabled ? 'checked' : ''}>
            <span class="alarm-toggle-slider"></span>
          </label>
        </div>

        <!-- Daily Start Time & Quick Reset -->
        <div class="alarm-section-card">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-size: 0.82rem; font-weight: 700; color: #E2E8F0;">⏰ Daily Study Start Time</div>
              <div style="font-size: 0.7rem; color: #94A3B8;">Auto-spaces all ${sched.isSunday ? 'Sunday 6.5h + AI' : 'Mon–Sat 5.0h'} blocks</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="time" id="alarm-daily-start-time" class="form-input" value="${cfg.dailyStartTime}" style="width: 118px; padding: 6px 8px; font-size: 0.82rem;">
              <button class="btn-secondary" id="btn-alarm-auto-space" style="font-size: 0.72rem; padding: 6px 10px;">Auto-Fill</button>
            </div>
          </div>
        </div>

        <!-- Per-Slot Alarm List -->
        <div class="alarm-section-card">
          <div style="font-size: 0.82rem; font-weight: 700; color: #E2E8F0; margin-bottom: 10px;">
            📅 Today's Scheduled Subject Alarms (${sched.isSunday ? 'Sunday Boost' : 'Mon–Sat'})
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${slotsHtml || '<div style="font-size: 0.78rem; color: #94A3B8;">No scheduled slots found for today.</div>'}
          </div>
        </div>

        <!-- Ringtone & Voice Settings -->
        <div class="alarm-section-card">
          <div style="font-size: 0.82rem; font-weight: 700; color: #E2E8F0; margin-bottom: 10px;">🔊 Sound & Voice Announcement</div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 10px;">
            <select id="alarm-ringtone-select" class="form-input" style="flex: 1 1 150px; padding: 7px 10px; font-size: 0.8rem;">
              ${tonesHtml}
            </select>
            <button class="btn-secondary" id="btn-alarm-preview-tone" style="font-size: 0.75rem; padding: 7px 12px;">▶ Preview</button>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: #CBD5E1; cursor: pointer;">
              <input type="checkbox" id="alarm-voice-toggle" ${cfg.voiceEnabled ? 'checked' : ''}>
              <span>Speak Voice Reminder</span>
            </label>
            <select id="alarm-voice-lang" class="form-input" style="width: 140px; padding: 5px 8px; font-size: 0.76rem;" ${!cfg.voiceEnabled ? 'disabled' : ''}>
              <option value="en-IN" ${cfg.voiceLang === 'en-IN' ? 'selected' : ''}>English (IN)</option>
              <option value="hi-IN" ${cfg.voiceLang === 'hi-IN' ? 'selected' : ''}>हिंदी / Hinglish</option>
            </select>
          </div>
        </div>

        <!-- Test Alarm & Browser Notifications -->
        <div class="alarm-section-card" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: space-between;">
          <button class="btn-primary" id="btn-alarm-quick-test" style="flex: 1 1 170px; justify-content: center; padding: 9px 14px; font-size: 0.8rem;">
            ⚡ Test Alarm (5 Sec)
          </button>
          <button class="btn-secondary" id="btn-alarm-notif-perm" style="flex: 1 1 150px; justify-content: center; padding: 9px 12px; font-size: 0.76rem; border-color: ${notifBadgeColor}; color: ${notifBadgeColor};">
            🔔 Notifications: ${notifLabel}
          </button>
        </div>

        <div style="font-size: 0.7rem; color: #94A3B8; line-height: 1.45; padding: 8px 10px; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px;">
          💡 <strong>Web Alarm Tip:</strong> Browser alarms ring reliably while this tab or installed PWA stays open. For lock-screen wake alarms when your phone is asleep, use the <a href="/downloads/GuruStudy-v1.0.apk" download style="color: #818CF8; text-decoration: underline;">GuruStudy Android APK</a>.
        </div>
      `;

      this.bindEvents();
    },

    bindEvents() {
      const masterToggle = document.getElementById('alarm-master-toggle');
      if (masterToggle) {
        masterToggle.addEventListener('change', () => {
          guruAlarms.saveConfig({ masterEnabled: masterToggle.checked });
          this.render();
          if (window.showGuruToast) {
            window.showGuruToast(masterToggle.checked ? '🔔 Study alarms enabled & armed!' : '🔕 Study alarms paused');
          }
        });
      }

      const startInput = document.getElementById('alarm-daily-start-time');
      const autoBtn = document.getElementById('btn-alarm-auto-space');
      const applyStartTime = () => {
        if (!startInput || !startInput.value) return;
        guruAlarms.saveConfig({ dailyStartTime: startInput.value, slotOverrides: {} });
        // Also clear overrides explicitly in localStorage
        const cfg = guruAlarms.loadConfig();
        cfg.slotOverrides = {};
        try { localStorage.setItem(guruAlarms.getConfigKey(), JSON.stringify(cfg)); } catch (_) {}
        if (window.GuruStore) {
          const prof = window.GuruStore.getState().profile || {};
          window.GuruStore.setState({ profile: { ...prof, dailyStartTime: startInput.value } });
        }
        this.render();
        if (window.showGuruToast) window.showGuruToast(`⏰ Timetable alarms recalculated from ${startInput.value}`);
      };
      if (autoBtn) autoBtn.addEventListener('click', applyStartTime);
      if (startInput) startInput.addEventListener('change', applyStartTime);

      document.querySelectorAll('.alarm-slot-time-input').forEach((inp) => {
        inp.addEventListener('change', () => {
          const idx = inp.getAttribute('data-slot-idx');
          const cfg = guruAlarms.loadConfig();
          const cur = cfg.slotOverrides[idx] || { enabled: true };
          guruAlarms.saveConfig({ slotOverrides: { [idx]: { ...cur, time: inp.value } } });
          this.rearmNow();
          if (window.showGuruToast) window.showGuruToast(`✓ Slot alarm updated to ${inp.value}`);
        });
      });

      document.querySelectorAll('.alarm-slot-toggle').forEach((chk) => {
        chk.addEventListener('change', () => {
          const idx = chk.getAttribute('data-slot-idx');
          const cfg = guruAlarms.loadConfig();
          const cur = cfg.slotOverrides[idx] || {};
          guruAlarms.saveConfig({ slotOverrides: { [idx]: { ...cur, enabled: chk.checked } } });
          const armed = this.rearmNow();
          const statusEl = document.getElementById('alarm-armed-status-text');
          if (statusEl) statusEl.textContent = `✓ ${armed} Upcoming Alarm(s) Armed Today`;
        });
      });

      const toneSelect = document.getElementById('alarm-ringtone-select');
      if (toneSelect) {
        toneSelect.addEventListener('change', () => {
          guruAlarms.saveConfig({ ringtone: toneSelect.value });
        });
      }

      const previewBtn = document.getElementById('btn-alarm-preview-tone');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => {
          const selectedTone = toneSelect ? toneSelect.value : 'Morning Bell';
          guruAlarms.ensureAudioReady();
          guruAlarms.playTone(selectedTone, 2);
        });
      }

      const voiceToggle = document.getElementById('alarm-voice-toggle');
      const voiceLang = document.getElementById('alarm-voice-lang');
      if (voiceToggle) {
        voiceToggle.addEventListener('change', () => {
          guruAlarms.saveConfig({ voiceEnabled: voiceToggle.checked });
          if (voiceLang) voiceLang.disabled = !voiceToggle.checked;
        });
      }
      if (voiceLang) {
        voiceLang.addEventListener('change', () => {
          guruAlarms.saveConfig({ voiceLang: voiceLang.value });
        });
      }

      const testBtn = document.getElementById('btn-alarm-quick-test');
      if (testBtn) {
        testBtn.addEventListener('click', () => {
          guruAlarms.ensureAudioReady();
          clearInterval(this.testCountdownTimer);
          let left = 5;
          testBtn.disabled = true;
          testBtn.textContent = `⏳ Ringing in ${left}s...`;
          this.testCountdownTimer = setInterval(() => {
            left--;
            if (left > 0) {
              testBtn.textContent = `⏳ Ringing in ${left}s...`;
            } else {
              clearInterval(this.testCountdownTimer);
              testBtn.disabled = false;
              testBtn.textContent = '⚡ Test Alarm (5 Sec)';
              this.close();
              const sched = this.getTodaySchedule();
              const firstSlot = (sched.schedule && sched.schedule[0]) || {
                subject: 'Mathematics',
                chapter: 'Real Numbers',
                durationMinutes: 120
              };
              const name = (window.GuruStore && window.GuruStore.getState().profile?.name) || 'Topper';
              guruAlarms.triggerAlarm(firstSlot, name, false);
            }
          }, 1000);
        });
      }

      const notifBtn = document.getElementById('btn-alarm-notif-perm');
      if (notifBtn) {
        notifBtn.addEventListener('click', async () => {
          await guruAlarms.requestNotificationPermission();
          this.render();
        });
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.GuruAlarmCenter = AlarmCenterUI;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AlarmCenterUI };
  }
})();
