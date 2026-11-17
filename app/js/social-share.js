/**
 * GuruStudy - Social Progress Card Canvas Generator & PDF Export (Prompt 24)
 * Generates high-res 1080x1920 Story cards for Instagram/WhatsApp and clean printable reports.
 */

class SocialShareManager {
  /**
   * Generates a 1080x1920 Instagram/WhatsApp Story progress card on an offscreen canvas
   */
  async generateStoryCard({ studentName, dayNumber, hoursStudied, streakDays, phaseName }) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 1. Premium Mesh Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(0.35, '#1E1B4B');
    bgGrad.addColorStop(0.7, '#312E81');
    bgGrad.addColorStop(1, '#0B0F19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle decorative glow circles
    ctx.save();
    ctx.filter = 'blur(80px)';
    ctx.fillStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.beginPath();
    ctx.arc(200, 300, 250, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.beginPath();
    ctx.arc(880, 1500, 280, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Top Header & App Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px Plus Jakarta Sans, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 GURUSTUDY • 88-DAY BLUEPRINT', 540, 180);

    ctx.font = '32px Plus Jakarta Sans, Arial';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('CBSE Class 10 Board Mission (2026–2027)', 540, 240);

    // 3. Central Glass Card Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    this.roundRect(ctx, 90, 320, 900, 1260, 48);
    ctx.fill();
    ctx.stroke();

    // Student Avatar Circle
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.arc(540, 460, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px Plus Jakarta Sans, Arial';
    ctx.fillText((studentName || 'S').charAt(0).toUpperCase(), 540, 485);

    // Student Name
    ctx.font = 'bold 58px Plus Jakarta Sans, Arial';
    ctx.fillText(studentName || 'Class 10 Student', 540, 600);

    // Mission Day Pill
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    this.roundRect(ctx, 340, 640, 400, 70, 35);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 36px Plus Jakarta Sans, Arial';
    ctx.fillText(`🔥 Day ${dayNumber} of 88 • ${streakDays}d Streak`, 540, 688);

    // Large Study Hours Ring / Stat
    ctx.fillStyle = '#60A5FA';
    ctx.font = 'bold 110px Plus Jakarta Sans, Arial';
    ctx.fillText(`${hoursStudied} Hours`, 540, 850);

    ctx.font = '34px Plus Jakarta Sans, Arial';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText("TODAY'S TARGET COMPLETED", 540, 920);

    // Phase Name
    ctx.fillStyle = '#A5B4FC';
    ctx.font = 'italic 34px Plus Jakarta Sans, Arial';
    ctx.fillText(`Phase: ${phaseName || 'Concept Mastery'}`, 540, 980);

    // Horizontal Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 1040);
    ctx.lineTo(920, 1040);
    ctx.stroke();

    // Subject Breakdown Badges
    const subjects = [
      { name: "Mathematics", hrs: "2.0h", col: "#3B82F6" },
      { name: "Science", hrs: "1.5h", col: "#10B981" },
      { name: "Social Science", hrs: "1.0h", col: "#F59E0B" },
      { name: "Languages / AI", hrs: "0.5h", col: "#EC4899" }
    ];

    let startY = 1130;
    subjects.forEach((subj) => {
      // Bar background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      this.roundRect(ctx, 160, startY - 45, 760, 70, 20);
      ctx.fill();

      // Subject dot
      ctx.fillStyle = subj.col;
      ctx.beginPath();
      ctx.arc(200, startY - 10, 12, 0, Math.PI * 2);
      ctx.fill();

      // Name & Hours
      ctx.font = 'bold 34px Plus Jakarta Sans, Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(subj.name, 230, startY);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#A5B4FC';
      ctx.fillText(subj.hrs, 880, startY);

      startY += 90;
    });

    // 4. Footer & Watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748B';
    ctx.font = '32px Plus Jakarta Sans, Arial';
    ctx.fillText('CBSE Class 10 Daily Discipline Companion', 540, 1660);

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 38px Plus Jakarta Sans, Arial';
    ctx.fillText('🌐 https://gurustudy.webguruji.online', 540, 1720);

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

  /**
   * Share via Native Mobile Web Share API or download PNG
   */
  async shareOrDownload(dataUrl, fileName = 'GuruStudy-Today-Progress.png') {
    // If mobile navigator.share supports files
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "GuruStudy 88-Day Progress",
            text: "My daily Class 10 study target is done on GuruStudy! 🎯",
            files: [file]
          });
          return true;
        }
      } catch (err) {
        console.warn('Web Share failed, downloading directly:', err);
      }
    }

    // Direct download fallback
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
    return true;
  }

  /**
   * Export clean printable PDF / print view
   */
  exportPrintableReport() {
    window.print();
  }
}

// Global instance
const guruSocialShare = new SocialShareManager();
