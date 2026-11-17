/**
 * GuruStudy - Performance Analytics, Sunday Mock Tests & Heatmap Engine (Phase 7)
 * URL: https://gurustudy.webguruji.online
 *
 * Implements:
 * - 88-Day GitHub-style SVG consistency heatmap (20 Nov 2026 – 15 Feb 2027)
 * - Pure SVG Subject Donut & Planned vs Actual Bar Charts (Zero external libraries)
 * - 13-Week Sunday Mock Test Score Trendline Chart
 * - Sunday Special Command Center & AI 417 Chapter progress
 * - Mock Test score logger with CBSE grade prediction (A1, A2, B1, etc.)
 * - Consecutive study streak tracker with Sunday Grace Shield
 * - CBSE Milestone Badges engine
 * - Shareable Canvas Report Card Image Generator
 */

class GuruAnalyticsEngine {
  constructor() {
    this.startDate = new Date(2026, 10, 20); // 20 Nov 2026
    this.endDate = new Date(2027, 1, 15);   // 15 Feb 2027
    this.totalDays = 88;
  }

  /**
   * Calculate Grade based on CBSE percentage scale
   */
  calculateGrade(percentage) {
    if (percentage >= 91) return { grade: 'A1', color: '#10B981', remark: 'Outstanding • Top 1/8th' };
    if (percentage >= 81) return { grade: 'A2', color: '#3B82F6', remark: 'Excellent • High Distinction' };
    if (percentage >= 71) return { grade: 'B1', color: '#6366F1', remark: 'Very Good • Strong Foundation' };
    if (percentage >= 61) return { grade: 'B2', color: '#8B5CF6', remark: 'Good • Needs Minor Practice' };
    if (percentage >= 51) return { grade: 'C1', color: '#F59E0B', remark: 'Fair • Revise Key NCERT Exercises' };
    if (percentage >= 41) return { grade: 'C2', color: '#F97316', remark: 'Average • Focus on Weak Concepts' };
    if (percentage >= 33) return { grade: 'D',  color: '#EF4444', remark: 'Passing • Needs Urgent Revision' };
    return { grade: 'E', color: '#DC2626', remark: 'Needs Immediate Remedial Focus' };
  }

  /**
   * Calculate current streak with Grace Shield
   */
  async calculateStreak() {
    if (typeof GuruDB === 'undefined') return { currentStreak: 0, longestStreak: 0, graceUsed: 0 };
    const allLogs = await GuruDB.getAllDailyLogs();
    const logMap = {};
    allLogs.forEach(l => { logMap[l.date] = l; });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let graceUsed = 0;

    const today = new Date();
    // Scan all 88 days up to today or totalDays
    for (let i = 0; i < this.totalDays; i++) {
      const d = new Date(this.startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      // If in the future, break
      if (d > today) break;

      const isSunday = d.getDay() === 0;
      const targetMins = isSunday ? 390 : 300;
      const log = logMap[dateStr];
      const studiedMins = log ? (log.total_minutes || 0) : 0;
      const pct = (studiedMins / targetMins) * 100;

      if (pct >= 80) {
        tempStreak++;
      } else if (isSunday && graceUsed < 3) { // 1 grace per month allowed
        graceUsed++;
        tempStreak++; // Grace shield protects streak
      } else {
        tempStreak = 0;
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    currentStreak = tempStreak;
    return { currentStreak, longestStreak, graceUsed };
  }

  /**
   * Compute subject planned vs studied hours
   */
  async getSubjectStats() {
    const defaultPlanned = {
      maths: 75 * 2.0 + 13 * 2.0,      // 176 hrs
      science: 75 * 1.5 + 13 * 2.0,    // 138.5 hrs
      sst: 75 * 1.0 + 13 * 1.5,        // 94.5 hrs
      language: 75 * 0.5 + 13 * 0.5,   // 44 hrs
      ai: 13 * 0.5                     // 6.5 hrs
    };

    const actualMinutes = {
      maths: 0,
      science: 0,
      sst: 0,
      language: 0,
      ai: 0
    };

    if (typeof GuruDB !== 'undefined') {
      const allLogs = await GuruDB.getAllDailyLogs();
      allLogs.forEach(l => {
        actualMinutes.maths += l.maths_minutes || 0;
        actualMinutes.science += l.science_minutes || 0;
        actualMinutes.sst += l.sst_minutes || 0;
        actualMinutes.language += l.language_minutes || 0;
        actualMinutes.ai += l.ai_minutes || 0;
      });
    }

    return {
      plannedHours: defaultPlanned,
      actualHours: {
        maths: Math.round((actualMinutes.maths / 60) * 10) / 10,
        science: Math.round((actualMinutes.science / 60) * 10) / 10,
        sst: Math.round((actualMinutes.sst / 60) * 10) / 10,
        language: Math.round((actualMinutes.language / 60) * 10) / 10,
        ai: Math.round((actualMinutes.ai / 60) * 10) / 10
      },
      actualMinutes
    };
  }

  /**
   * Render 88-Day GitHub-style Contribution Heatmap (Pure SVG)
   */
  async renderHeatmapSVG(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let logMap = {};
    if (typeof GuruDB !== 'undefined') {
      const allLogs = await GuruDB.getAllDailyLogs();
      allLogs.forEach(l => { logMap[l.date] = l; });
    }

    // 88 days organized in columns of 7 days (weeks)
    // 88 days = 13 weeks (12 full weeks of 7 + 4 days)
    const boxSize = 14;
    const gap = 4;
    const cols = 13;
    const rows = 7;
    const width = cols * (boxSize + gap) + 30;
    const height = rows * (boxSize + gap) + 35;

    let svg = `<svg viewBox="0 0 ${width} ${height}" class="heatmap-svg" style="width: 100%; max-width: 650px; height: auto;">`;

    // Month headers
    svg += `<text x="30" y="10" fill="#94A3B8" font-size="10" font-family="system-ui">Nov</text>`;
    svg += `<text x="110" y="10" fill="#94A3B8" font-size="10" font-family="system-ui">Dec</text>`;
    svg += `<text x="210" y="10" fill="#94A3B8" font-size="10" font-family="system-ui">Jan</text>`;
    svg += `<text x="310" y="10" fill="#94A3B8" font-size="10" font-family="system-ui">Feb</text>`;

    // Day labels (Fri, Sun, Wed)
    svg += `<text x="2" y="24" fill="#64748B" font-size="9" font-family="system-ui">F</text>`;
    svg += `<text x="2" y="42" fill="#64748B" font-size="9" font-family="system-ui">S</text>`;
    svg += `<text x="2" y="60" fill="#EF4444" font-weight="600" font-size="9" font-family="system-ui">Su</text>`;
    svg += `<text x="2" y="78" fill="#64748B" font-size="9" font-family="system-ui">M</text>`;
    svg += `<text x="2" y="96" fill="#64748B" font-size="9" font-family="system-ui">T</text>`;
    svg += `<text x="2" y="114" fill="#64748B" font-size="9" font-family="system-ui">W</text>`;
    svg += `<text x="2" y="132" fill="#64748B" font-size="9" font-family="system-ui">Th</text>`;

    for (let i = 0; i < this.totalDays; i++) {
      const d = new Date(this.startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isSunday = d.getDay() === 0;
      const targetMins = isSunday ? 390 : 300;

      const col = Math.floor(i / 7);
      const row = i % 7;
      const x = 25 + col * (boxSize + gap);
      const y = 16 + row * (boxSize + gap);

      const log = logMap[dateStr];
      const studiedMins = log ? (log.total_minutes || 0) : 0;
      const pct = (studiedMins / targetMins) * 100;

      // Color intensity mapping
      let fill = '#1E293B'; // Gray 0%
      let stroke = 'rgba(255,255,255,0.05)';
      if (studiedMins > 0 && pct < 50) {
        fill = '#065F46'; // Light Green
      } else if (pct >= 50 && pct < 100) {
        fill = '#059669'; // Medium Green
      } else if (pct >= 100) {
        fill = isSunday ? '#F59E0B' : '#10B981'; // Gold for Sunday, Emerald for weekdays
        stroke = isSunday ? '#FDE68A' : '#6EE7B7';
      }

      const tooltipText = `Day ${i + 1} (${dateStr}): ${Math.round(studiedMins / 60 * 10) / 10}h / ${targetMins / 60}h (${Math.round(pct)}%)`;

      svg += `<rect x="${x}" y="${y}" width="${boxSize}" height="${boxSize}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="0.8">
        <title>${tooltipText}</title>
      </rect>`;
    }

    svg += '</svg>';
    container.innerHTML = svg;
  }

  /**
   * Render Subject Hours Donut Chart (Pure SVG)
   */
  async renderSubjectDonutSVG(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stats = await this.getSubjectStats();
    const data = [
      { name: 'Maths', value: stats.actualHours.maths || 1, color: '#3B82F6' },
      { name: 'Science', value: stats.actualHours.science || 1, color: '#10B981' },
      { name: 'SST', value: stats.actualHours.sst || 1, color: '#F59E0B' },
      { name: 'Language', value: stats.actualHours.language || 1, color: '#EC4899' },
      { name: 'AI 417', value: stats.actualHours.ai || 1, color: '#8B5CF6' }
    ];

    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    const radius = 60;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;
    let circles = '';

    data.forEach(item => {
      const sliceRatio = item.value / total;
      const strokeDash = sliceRatio * circumference;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += strokeDash;

      circles += `<circle cx="90" cy="90" r="${radius}" fill="transparent"
        stroke="${item.color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${strokeDash} ${circumference}"
        stroke-dashoffset="${strokeDashoffset}"
        stroke-linecap="round"
        style="transition: stroke-dasharray 0.5s ease;">
        <title>${item.name}: ${item.value} hrs</title>
      </circle>`;
    });

    const totalHoursActual = Math.round((stats.actualHours.maths + stats.actualHours.science + stats.actualHours.sst + stats.actualHours.language + stats.actualHours.ai) * 10) / 10;

    const svg = `<svg viewBox="0 0 180 180" style="width: 160px; height: 160px; transform: rotate(-90deg);">
      <circle cx="90" cy="90" r="${radius}" fill="transparent" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}"/>
      ${circles}
    </svg>
    <div style="position: absolute; text-align: center; pointer-events: none;">
      <div style="font-size: 1.5rem; font-weight: 700; color: #F8FAFC;">${totalHoursActual}h</div>
      <div style="font-size: 0.72rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Studied</div>
    </div>`;

    container.innerHTML = `<div style="position: relative; display: flex; align-items: center; justify-content: center; width: 100%;">${svg}</div>`;
  }

  /**
   * Render 13-Week Sunday Mock Test Score Trend Line (Pure SVG)
   */
  async renderMockTrendlineSVG(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let mockScores = [];
    if (typeof GuruDB !== 'undefined') {
      mockScores = await GuruDB.getSundayMockScores();
    }

    const width = 500;
    const height = 180;
    const padding = 35;
    const usableW = width - padding * 2;
    const usableH = height - padding * 2;

    let svg = `<svg viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: 550px; height: auto;">`;

    // Horizontal guideline lines at 33% (pass), 60% (first div), 80% (distinction), 95% (target)
    const targets = [
      { yVal: 95, label: '95% Target', color: '#10B981' },
      { yVal: 80, label: '80%', color: '#6366F1' },
      { yVal: 60, label: '60%', color: 'rgba(255,255,255,0.15)' },
      { yVal: 33, label: '33% Pass', color: 'rgba(239, 68, 68, 0.4)' }
    ];

    targets.forEach(t => {
      const y = padding + usableH - (t.yVal / 100) * usableH;
      svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="${t.color}" stroke-dasharray="3,3" stroke-width="0.8"/>`;
      svg += `<text x="${width - padding + 4}" y="${y + 3}" fill="${t.color}" font-size="8" font-family="system-ui">${t.label}</text>`;
    });

    // 13 Sundays marks
    const points = [];
    for (let w = 1; w <= 13; w++) {
      const x = padding + ((w - 1) / 12) * usableW;
      const found = mockScores.find(s => s.week_number === w);
      const pct = found ? found.percentage : null;

      // X-axis label
      svg += `<text x="${x}" y="${height - 10}" fill="#94A3B8" font-size="9" text-anchor="middle" font-family="system-ui">W${w}</text>`;

      if (pct !== null) {
        const y = padding + usableH - (pct / 100) * usableH;
        points.push({ x, y, pct, w, test: found.test_name });
      }
    }

    // Draw connecting line if we have >= 2 points
    if (points.length >= 2) {
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      svg += `<path d="${pathD}" fill="none" stroke="#6366F1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    // Draw point circles
    points.forEach(p => {
      svg += `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#1E1B4B" stroke="#818CF8" stroke-width="2.5">
        <title>Week ${p.w}: ${p.pct}% (${p.test})</title>
      </circle>`;
      svg += `<text x="${p.x}" y="${p.y - 8}" fill="#F8FAFC" font-size="8" font-weight="700" text-anchor="middle">${Math.round(p.pct)}%</text>`;
    });

    if (points.length === 0) {
      svg += `<text x="${width / 2}" y="${height / 2}" fill="#64748B" font-size="12" text-anchor="middle">Log your Sunday practice tests to see score trend</text>`;
    }

    svg += '</svg>';
    container.innerHTML = svg;
  }

  /**
   * Milestone Badges Engine
   */
  async evaluateMilestones() {
    const milestones = [
      { id: 'first_5h', name: 'First 5-Hour Day', icon: '⚡', desc: 'Completed a full 5-hour study schedule', unlocked: false },
      { id: 'streak_7', name: '7-Day Discipline', icon: '🔥', desc: 'Maintained a 7-day study streak', unlocked: false },
      { id: 'sunday_ai', name: 'Sunday AI Master', icon: '🤖', desc: 'Completed at least 3 AI Code 417 units', unlocked: false },
      { id: 'ncert_maths', name: 'Maths Conqueror', icon: '📐', desc: 'Studied over 30 hours of NCERT Mathematics', unlocked: false },
      { id: 'board_warrior', name: '50-Day Board Warrior', icon: '🛡️', desc: 'Hit Day 50 of the 88-day roadmap', unlocked: false }
    ];

    if (typeof GuruDB === 'undefined') return milestones;

    const streakData = await this.calculateStreak();
    const stats = await this.getSubjectStats();
    const allLogs = await GuruDB.getAllDailyLogs();

    // Check first 5h
    if (allLogs.some(l => (l.total_minutes || 0) >= 300)) {
      milestones[0].unlocked = true;
    }
    // Check 7 day streak
    if (streakData.longestStreak >= 7) {
      milestones[1].unlocked = true;
    }
    // Check Sunday AI (1.5 hours or more = 3 sessions)
    if (stats.actualHours.ai >= 1.5) {
      milestones[2].unlocked = true;
    }
    // Check NCERT Maths (>= 30 hours)
    if (stats.actualHours.maths >= 30) {
      milestones[3].unlocked = true;
    }
    // Check 50-day board warrior
    if (allLogs.length >= 50) {
      milestones[4].unlocked = true;
    }

    return milestones;
  }

  /**
   * Generate Downloadable Report Card Image (HTML5 Canvas)
   */
  async generateReportCardImage(studentName = 'Student', dayNumber = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // High resolution 4:5 social/parent sharing aspect ratio
    const ctx = canvas.getContext('2d');

    // Background Gradient (Deep Space Dark)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1350);
    bgGrad.addColorStop(0, '#060B19');
    bgGrad.addColorStop(0.5, '#0B132B');
    bgGrad.addColorStop(1, '#050811');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Decorative Glow Orbs
    const glow1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 450);
    glow1.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1080, 800);

    const glow2 = ctx.createRadialGradient(880, 1100, 0, 880, 1100, 400);
    glow2.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 700, 1080, 650);

    // Card Glass Container
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, 60, 60, 960, 1230, 36);
    ctx.fill();
    ctx.stroke();

    // Top Header: Brand & Mission
    ctx.fillStyle = '#6366F1';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('GURUSTUDY • CBSE CLASS 10', 110, 140);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('MISSION BOARD EXAMS 2026-27 (88 DAYS BLUEPRINT)', 110, 180);

    // Student Badge Box
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.strokeStyle = '#6366F1';
    this.roundRect(ctx, 110, 220, 860, 140, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(studentName, 140, 290);

    ctx.fillStyle = '#A5B4FC';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Target: 95%+ in CBSE Boards | Verified Daily Performance`, 140, 330);

    // Day & Streak Metrics Pill
    const streakData = await this.calculateStreak();
    const stats = await this.getSubjectStats();
    const totalActualHrs = Math.round((stats.actualHours.maths + stats.actualHours.science + stats.actualHours.sst + stats.actualHours.language + stats.actualHours.ai) * 10) / 10;

    const metrics = [
      { label: 'BLUEPRINT PROGRESS', val: `Day ${dayNumber}/88`, color: '#6366F1' },
      { label: 'STUDY STREAK', val: `${streakData.currentStreak} Days 🔥`, color: '#F59E0B' },
      { label: 'HOURS STUDIED', val: `${totalActualHrs} hrs`, color: '#10B981' }
    ];

    metrics.forEach((m, idx) => {
      const boxX = 110 + idx * 295;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.roundRect(ctx, boxX, 390, 270, 150, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(m.label, boxX + 24, 435);

      ctx.fillStyle = m.color;
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText(m.val, boxX + 24, 495);
    });

    // Subject Breakdown Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('SUBJECT MASTERY & REVISION METRICS', 110, 600);

    // Subject Progress Bars
    const subjects = [
      { name: 'Mathematics (NCERT 14 Chapters)', hrs: stats.actualHours.maths, target: stats.plannedHours.maths, color: '#3B82F6' },
      { name: 'Science (Physics, Chem, Bio 13 Chapters)', hrs: stats.actualHours.science, target: stats.plannedHours.science, color: '#10B981' },
      { name: 'Social Science (History, Geo, Civics, Eco)', hrs: stats.actualHours.sst, target: stats.plannedHours.sst, color: '#F59E0B' },
      { name: 'English & Hindi (Grammar, Writing, Literature)', hrs: stats.actualHours.language, target: stats.plannedHours.language, color: '#EC4899' },
      { name: 'Artificial Intelligence (Subject Code 417)', hrs: stats.actualHours.ai, target: stats.plannedHours.ai, color: '#8B5CF6' }
    ];

    subjects.forEach((s, idx) => {
      const barY = 640 + idx * 95;

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(s.name, 110, barY);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '20px sans-serif';
      ctx.fillText(`${s.hrs}h / ${s.target}h`, 870, barY);

      // Track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      this.roundRect(ctx, 110, barY + 12, 860, 18, 9);
      ctx.fill();

      // Filled progress
      const pct = Math.min(1, s.hrs / (s.target || 1));
      if (pct > 0) {
        ctx.fillStyle = s.color;
        this.roundRect(ctx, 110, barY + 12, Math.max(20, 860 * pct), 18, 9);
        ctx.fill();
      }
    });

    // Footer Verified Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    this.roundRect(ctx, 110, 1150, 860, 95, 18);
    ctx.fill();

    ctx.fillStyle = '#6EE7B7';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('✓ Verified Study Log • gurustudy.webguruji.online', 140, 1205);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '18px sans-serif';
    ctx.fillText('Official CBSE 2026-27 Prep Tracker by HarshGuruJi', 580, 1205);

    return canvas.toDataURL('image/png');
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

// Global Singleton Instance
window.GuruAnalytics = new GuruAnalyticsEngine();
