/**
 * GuruStudy - Offline-First Database & Supabase Cloud Sync Engine (`db-sync.js`)
 * Instant LocalStorage (`gurustudy_db_v1`) + Background Cloud Sync
 * Author: HarshGuruJi (contact@webguruji.online)
 */

class GuruDBEngine {
  constructor() {
    this.STORAGE_KEY = 'gurustudy_db_v1';
    this.PROFILE_KEY = 'gurustudy_user_profile';
    this.AUTH_KEY = 'gurustudy_auth_session';
    this.QUEUE_KEY = 'gurustudy_sync_queue';
    
    // Supabase Configuration (configurable by user or environment)
    this.supabaseUrl = (typeof localStorage !== 'undefined' ? localStorage.getItem('gurustudy_supabase_url') : null) || 'https://wazbcvnypaeywghxocqu.supabase.co';
    this.supabaseAnonKey = (typeof localStorage !== 'undefined' ? localStorage.getItem('gurustudy_supabase_key') : null) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake_anon_fallback';
    this.supabaseClient = null;
    this.supabase = null;

    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.isSyncing = false;
    this.listeners = [];

    if (typeof localStorage !== 'undefined') {
      this.initDatabase();
    }
    if (typeof window !== 'undefined') {
      this.initNetworkListeners();
      this.initSupabase();
    }
  }

  /**
   * Initialize local database with default structures if empty
   */
  initDatabase() {
    let data = this.getRawData();
    if (!data) {
      data = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        profile: {
          fullName: 'Harsh Patel',
          schoolName: '',
          targetPercentage: 95,
          medium: 'English',
          secondLanguage: 'Hindi Course A',
          dailyStartTime: '16:00',
          aiSundayEnabled: true,
          streakCount: 0,
          lastStudyDate: null,
          voiceAlarmsEnabled: true,
          notificationsEnabled: true,
          vibrateEnabled: true,
          theme: 'dark'
        },
        dailyLogs: {},          // key: YYYY-MM-DD -> { mathsMins, scienceMins, sstMins, langMins, aiMins, targetMins, isCompleted }
        syllabusProgress: {},   // key: chapter_id -> { ncertRead, exercisesDone, pyqDone, revisionCount }
        alarmSettings: {},      // key: subject -> { scheduledTime, durationMins, ringtone, isActive }
        sundayMockScores: [],   // array of { week, date, subject, marksScored, maxMarks, grade }
        streakGraceShields: 1   // 1 grace shield per month
      };
      this.saveRawData(data);
    }
  }

  getRawData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('GuruDB Error reading localStorage', e);
      return null;
    }
  }

  saveRawData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners('data_changed', data);
    } catch (e) {
      console.error('GuruDB Error saving localStorage', e);
    }
  }

  initNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners('network_status', { isOnline: true });
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners('network_status', { isOnline: false });
    });
  }

  initSupabase() {
    if (typeof window.supabase !== 'undefined' && this.supabaseUrl && !this.supabaseUrl.includes('fake')) {
      try {
        this.supabaseClient = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
        this.checkAuthSession();
      } catch (err) {
        console.warn('Supabase initialization fallback to offline-first mode', err);
      }
    }
  }

  // ----------------------------------------------------------------------------
  // PROFILE & ONBOARDING OPERATIONS
  // ----------------------------------------------------------------------------
  getProfile() {
    const data = this.getRawData() || { profile: {} };
    let preConfig = {};
    try {
      if (typeof localStorage !== 'undefined') {
        const pre = localStorage.getItem(this.PROFILE_KEY);
        if (pre) preConfig = JSON.parse(pre);
      }
    } catch (_) {}
    const p = { ...(data.profile || {}), ...preConfig };
    const name = p.student_name || p.fullName || p.name || '';
    const hindiCourse = p.hindi_course || (String(p.secondLanguage || '').includes('B') ? 'B' : 'A');
    const startTime = p.daily_start_time || p.dailyStartTime || '16:00';
    return {
      ...p,
      student_name: name,
      fullName: name || 'Class 10 Topper',
      hindi_course: hindiCourse,
      secondLanguage: p.secondLanguage || `Hindi Course ${hindiCourse}`,
      daily_start_time: startTime,
      dailyStartTime: startTime,
      target_percentage: p.target_percentage || p.targetPercentage || 95
    };
  }

  updateProfile(profileUpdates) {
    const data = this.getRawData() || { profile: {}, dailyLogs: {}, syllabusProgress: {}, alarmSettings: {}, sundayMockScores: [] };
    const merged = { ...(data.profile || {}), ...(profileUpdates || {}), updatedAt: new Date().toISOString() };
    if (merged.student_name && !merged.fullName) merged.fullName = merged.student_name;
    if (merged.fullName && !merged.student_name) merged.student_name = merged.fullName;
    if (merged.daily_start_time) merged.dailyStartTime = merged.daily_start_time;
    if (merged.hindi_course) merged.secondLanguage = `Hindi Course ${merged.hindi_course}`;
    data.profile = merged;
    this.saveRawData(data);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify(merged));
      }
    } catch (_) {}
    this.enqueueSync('profile', data.profile);
    return data.profile;
  }

  async saveProfile(profileUpdates) {
    return this.updateProfile(profileUpdates);
  }

  isOnboardingCompleted() {
    return typeof localStorage !== 'undefined' && localStorage.getItem('gurustudy_onboarding_completed') === 'true';
  }

  completeOnboarding(profileData) {
    this.updateProfile(profileData);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gurustudy_onboarding_completed', 'true');
    }
    this.notifyListeners('onboarding_completed', profileData);
  }

  // ----------------------------------------------------------------------------
  // DAILY LOGS (STUDY MINUTES & TARGETS)
  // ----------------------------------------------------------------------------
  getDailyLog(dateKey) {
    const data = this.getRawData() || { dailyLogs: {} };
    const existing = (data.dailyLogs && data.dailyLogs[dateKey]) || {
      studyDate: dateKey,
      mathsMins: 0,
      scienceMins: 0,
      sstMins: 0,
      langMins: 0,
      aiMins: 0,
      targetMins: 300,
      isCompleted: false
    };
    const subMins = existing.subject_minutes || {
      maths: existing.mathsMins || 0,
      science: existing.scienceMins || 0,
      sst: existing.sstMins || 0,
      language: existing.langMins || 0,
      ai: existing.aiMins || 0
    };
    const totalMins = typeof existing.total_minutes === 'number'
      ? existing.total_minutes
      : (subMins.maths + subMins.science + subMins.sst + subMins.language + subMins.ai);
    return {
      ...existing,
      studyDate: dateKey,
      mathsMins: subMins.maths,
      scienceMins: subMins.science,
      sstMins: subMins.sst,
      langMins: subMins.language,
      aiMins: subMins.ai,
      subject_minutes: subMins,
      total_minutes: totalMins
    };
  }

  async saveDailyLog(dateKey, logObj) {
    const data = this.getRawData() || { dailyLogs: {} };
    if (!data.dailyLogs) data.dailyLogs = {};
    const sub = (logObj && logObj.subject_minutes) || {};
    const maths = sub.maths ?? logObj.mathsMins ?? 0;
    const science = sub.science ?? logObj.scienceMins ?? 0;
    const sst = sub.sst ?? logObj.sstMins ?? 0;
    const language = sub.language ?? logObj.langMins ?? 0;
    const ai = sub.ai ?? logObj.aiMins ?? 0;
    const total = typeof logObj.total_minutes === 'number' ? logObj.total_minutes : (maths + science + sst + language + ai);
    const normalized = {
      ...logObj,
      studyDate: dateKey,
      mathsMins: maths,
      scienceMins: science,
      sstMins: sst,
      langMins: language,
      aiMins: ai,
      subject_minutes: { maths, science, sst, language, ai },
      total_minutes: total
    };
    data.dailyLogs[dateKey] = normalized;
    this.saveRawData(data);
    this.enqueueSync('daily_log', normalized);
    return normalized;
  }

  logStudyMinutes(dateKey, subjectName, minutesAdded) {
    const data = this.getRawData();
    const currentLog = data.dailyLogs[dateKey] || {
      studyDate: dateKey,
      mathsMins: 0,
      scienceMins: 0,
      sstMins: 0,
      langMins: 0,
      aiMins: 0,
      targetMins: 300,
      isCompleted: false
    };

    const s = subjectName.toLowerCase();
    if (s.includes('math')) {
      currentLog.mathsMins += minutesAdded;
    } else if (s.includes('scien')) {
      currentLog.scienceMins += minutesAdded;
    } else if (s.includes('social') || s.includes('sst')) {
      currentLog.sstMins += minutesAdded;
    } else if (s.includes('artificial') || s.includes('ai')) {
      currentLog.aiMins += minutesAdded;
    } else {
      currentLog.langMins += minutesAdded;
    }

    const totalMins = currentLog.mathsMins + currentLog.scienceMins + currentLog.sstMins + currentLog.langMins + currentLog.aiMins;
    if (totalMins >= currentLog.targetMins * 0.8) {
      currentLog.isCompleted = true;
      this.updateStreakOnCompletion(dateKey);
    }

    data.dailyLogs[dateKey] = currentLog;
    this.saveRawData(data);
    this.enqueueSync('daily_log', currentLog);
    return currentLog;
  }

  updateStreakOnCompletion(completedDateKey) {
    const data = this.getRawData();
    if (data.profile.lastStudyDate !== completedDateKey) {
      data.profile.streakCount = (data.profile.streakCount || 0) + 1;
      data.profile.lastStudyDate = completedDateKey;
      this.saveRawData(data);
    }
  }

  getAllDailyLogs() {
    const data = this.getRawData();
    return data.dailyLogs || {};
  }

  // ----------------------------------------------------------------------------
  // SYLLABUS CHECKLIST OPERATIONS
  // ----------------------------------------------------------------------------
  getChapterProgress(chapterId) {
    const data = this.getRawData();
    return data.syllabusProgress[chapterId] || {
      ncertRead: false,
      exercisesDone: false,
      pyqDone: false,
      revisionCount: 0
    };
  }

  toggleChapterCheckbox(chapterId, fieldName, value) {
    const data = this.getRawData();
    const current = data.syllabusProgress[chapterId] || {
      ncertRead: false,
      exercisesDone: false,
      pyqDone: false,
      revisionCount: 0
    };

    current[fieldName] = (value !== undefined) ? value : !current[fieldName];
    if (fieldName === 'revisionDone' && current[fieldName]) {
      current.revisionCount = (current.revisionCount || 0) + 1;
    }

    data.syllabusProgress[chapterId] = current;
    this.saveRawData(data);
    this.enqueueSync('syllabus_progress', { chapterId, ...current });
    return current;
  }

  getAllSyllabusProgress() {
    const data = this.getRawData();
    return data.syllabusProgress || {};
  }

  // ----------------------------------------------------------------------------
  // SUNDAY MOCK TEST SCORES
  // ----------------------------------------------------------------------------
  addSundayMockScore(scoreItem) {
    // scoreItem: { week, date, subject, marksScored, maxMarks }
    const data = this.getRawData();
    const pct = Math.round((scoreItem.marksScored / (scoreItem.maxMarks || 80)) * 100);
    let grade = 'A1';
    if (pct < 40) grade = 'D';
    else if (pct < 50) grade = 'C2';
    else if (pct < 60) grade = 'C1';
    else if (pct < 70) grade = 'B2';
    else if (pct < 80) grade = 'B1';
    else if (pct < 90) grade = 'A2';
    else grade = 'A1';

    const fullItem = {
      ...scoreItem,
      id: 'mock_' + Date.now(),
      percentage: pct,
      gradePrediction: grade,
      timestamp: new Date().toISOString()
    };

    data.sundayMockScores = data.sundayMockScores || [];
    // remove existing if same week & subject
    data.sundayMockScores = data.sundayMockScores.filter(s => !(s.week === scoreItem.week && s.subject === scoreItem.subject));
    data.sundayMockScores.push(fullItem);

    this.saveRawData(data);
    this.enqueueSync('mock_score', fullItem);
    return fullItem;
  }

  getSundayMockScores() {
    const data = this.getRawData();
    return data.sundayMockScores || [];
  }

  // ----------------------------------------------------------------------------
  // CLOUD SYNC QUEUE & SUPABASE INTEGRATION
  // ----------------------------------------------------------------------------
  enqueueSync(actionType, payload) {
    if (!this.isOnline || !this.supabaseClient) {
      // Store in queue
      try {
        const queue = JSON.parse(localStorage.getItem(this.QUEUE_KEY) || '[]');
        queue.push({ actionType, payload, timestamp: Date.now() });
        localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
      } catch (e) {
        console.error('Failed to enqueue sync action', e);
      }
      return;
    }
    this.processSyncQueue();
  }

  async processSyncQueue() {
    if (!this.isOnline || !this.supabaseClient || this.isSyncing) return;
    this.isSyncing = true;
    this.notifyListeners('sync_status', { syncing: true });

    try {
      const queue = JSON.parse(localStorage.getItem(this.QUEUE_KEY) || '[]');
      if (queue.length === 0) {
        this.isSyncing = false;
        this.notifyListeners('sync_status', { syncing: false, success: true, count: 0 });
        return;
      }

      // Process batches if authenticated
      const { data: { user } } = await this.supabaseClient.auth.getUser();
      if (user) {
        for (const item of queue) {
          if (item.actionType === 'profile') {
            await this.supabaseClient.from('profiles').upsert({ id: user.id, ...item.payload });
          } else if (item.actionType === 'daily_log') {
            await this.supabaseClient.from('daily_logs').upsert({ user_id: user.id, ...item.payload });
          }
        }
        localStorage.removeItem(this.QUEUE_KEY);
      }
      this.notifyListeners('sync_status', { syncing: false, success: true });
    } catch (err) {
      console.warn('Sync queue execution postponed', err);
      this.notifyListeners('sync_status', { syncing: false, success: false });
    } finally {
      this.isSyncing = false;
    }
  }

  async checkAuthSession() {
    if (!this.supabaseClient) return null;
    try {
      const { data: { session } } = await this.supabaseClient.auth.getSession();
      return session;
    } catch (err) {
      return null;
    }
  }

  // ----------------------------------------------------------------------------
  // BACKUP & RESTORE (MANUAL JSON EXPORT/IMPORT)
  // ----------------------------------------------------------------------------
  exportBackupJson() {
    const data = this.getRawData();
    const str = JSON.stringify(data, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GuruStudy_Backup_88Days_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  }

  restoreBackupJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile || !parsed.dailyLogs) {
        throw new Error('Invalid GuruStudy backup file format');
      }
      this.saveRawData(parsed);
      this.notifyListeners('data_restored', parsed);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // ----------------------------------------------------------------------------
  // LISTENER OBSERVER PATTERN
  // ----------------------------------------------------------------------------
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  async saveAlarmSettings(settings) {
    const data = this.getRawData() || {};
    data.alarmSettings = { ...(data.alarmSettings || {}), ...(settings || {}) };
    this.saveRawData(data);
    return data.alarmSettings;
  }

  async saveSundayMockScore(scoreItem) {
    const normalized = {
      week: scoreItem.week_number || scoreItem.week || 1,
      testName: scoreItem.test_name || scoreItem.testName || 'Sunday Mock',
      subject: scoreItem.subject || 'General Mock',
      marksScored: scoreItem.marks_obtained ?? scoreItem.marksScored ?? 0,
      maxMarks: scoreItem.total_marks ?? scoreItem.maxMarks ?? 80,
      percentage: scoreItem.percentage ?? 0,
      grade: scoreItem.grade || 'A1',
      ...scoreItem
    };
    return this.addSundayMockScore(normalized);
  }

  getAllMockResults() {
    return this.getSundayMockScores();
  }

  getAllChapterStatuses() {
    return this.getAllSyllabusProgress();
  }

  markChapterProgress(chapterId, fieldName, value = true) {
    return this.toggleChapterCheckbox(chapterId, fieldName, value);
  }

  notifyListeners(eventType, payload) {
    this.listeners.forEach(cb => {
      try {
        cb(eventType, payload);
      } catch (err) {
        console.error('GuruDB listener error', err);
      }
    });
  }
}

// Global singleton instance (both GuruDB & guruDB point to the same instance — zero class shadowing)
const guruDB = new GuruDBEngine();
const GuruDB = guruDB;

if (typeof window !== 'undefined') {
  window.GuruDB = guruDB;
  window.guruDB = guruDB;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GuruDBEngine, GuruDB, guruDB };
}
