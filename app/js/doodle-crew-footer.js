/**
 * GuruStudy - Interactive Doodle Crew Footer (`doodle-crew-footer.js`)
 * Adapted faithfully from DoodleCrewFooter for GuruStudy's Midnight Indigo theme (#060B19).
 *
 * Features:
 * - Giant dry-brush ink wordmark: "GURUSTUDY" with SVG rough ink texture & dust puffs
 * - 6 hand-drawn interactive crew characters (yeti, bird, mushroom, kid, ghost, cat)
 *   living on the letters with cursor eye-tracking, natural blinking, 8fps line-boil,
 *   idle animations, click-to-hop, and GuruStudy motivational speech bubbles
 * - 12 drifting interactive ink doodles with sway physics, pointer repulsion, and tap-to-pop
 * - Choreographed IntersectionObserver storyboard reveal on scroll
 * - Hand-drawn squiggle underlines on links & smooth Back-to-Top button
 *
 * Zero external dependencies — pure Vanilla JS + inline SVG + CSS.
 * Author: HarshGuruJi (contact@webguruji.online)
 */

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const FONT_SIZE = 200;
  const DEFAULT_FONT = '"Arial Black", "Plus Jakarta Sans", "Inter", "Helvetica Neue", Arial, sans-serif';
  const DEFAULT_SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';

  /* =========================================================================
     1. PURE MATH & LAYOUT HELPERS (from DoodleCrewFooter)
     ========================================================================= */
  function hash(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function layoutWord(advances, tracking, fontSize) {
    const x = [];
    const w = [];
    let at = 0;
    const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize;
    for (let i = 0; i < advances.length; i++) {
      const a = Number.isFinite(advances[i]) && advances[i] > 0 ? advances[i] : 0;
      x.push(at);
      w.push(a);
      at += a + (i < advances.length - 1 ? gap : 0);
    }
    return { x, w, width: Math.max(0, at) };
  }

  function seatPoint(seat, letterX, letterW, cap, offset, scale) {
    const x = letterX + letterW * (0.5 + (Number.isFinite(offset) ? offset : 0));
    if (seat === 'top') return { x, y: -cap };
    if (seat === 'behind') return { x, y: -cap + 30 * scale };
    return { x, y: 0 };
  }

  function lookAt(ex, ey, tx, ty, max, reach) {
    const dx = tx - ex;
    const dy = ty - ey;
    const d = Math.hypot(dx, dy);
    if (!Number.isFinite(d) || d < 1e-6 || max <= 0) return { x: 0, y: 0 };
    const k = (max * Math.min(1, d / Math.max(1e-6, reach))) / d;
    return { x: dx * k, y: dy * k };
  }

  function stepFloater(f, dt, t, w, h, px, py, radius, rand) {
    const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05);
    const m = 40;
    if (f.pop > 0) {
      f.pop -= step;
      if (f.pop <= 0) {
        f.pop = 0;
        f.x = rand() * w;
        f.y = -m;
        f.vx = 0;
        f.vy = f.fall;
      }
      return f;
    }
    const sway = Math.sin(t * 0.7 + f.phase) * 14;
    if (Number.isFinite(px) && Number.isFinite(py) && radius > 0) {
      const dx = f.x - px;
      const dy = f.y - py;
      const d = Math.hypot(dx, dy);
      if (d < radius && d > 0.01) {
        const k = (1 - d / radius) * (1 - d / radius) * 2400;
        f.vx += (dx / d) * k * step;
        f.vy += (dy / d) * k * step;
        f.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step;
      }
    }
    const ease = Math.min(1, step * 2.4);
    f.vx += (sway - f.vx) * ease;
    f.vy += (f.fall - f.vy) * ease;
    f.vr += (Math.sin(f.phase * 3) * 18 - f.vr) * Math.min(1, step * 0.8);
    f.x += f.vx * step;
    f.y += f.vy * step;
    f.rot = (f.rot + f.vr * step) % 360;
    if (f.y > h + m) {
      f.y = -m;
      f.x = rand() * w;
    } else if (f.y < -m * 3) {
      f.y = h + m;
    }
    if (f.x < -m) f.x = w + m;
    else if (f.x > w + m) f.x = -m;
    return f;
  }

  function timeline(letters, crew, words, actions) {
    const L = Math.max(0, Math.floor(letters) || 0);
    const C = Math.max(0, Math.floor(crew) || 0);
    const W = Math.max(0, Math.floor(words) || 0);
    const A = Math.max(0, Math.floor(actions) || 0);
    const letter = (i) => 160 + i * 75;
    const crewStart = letter(Math.max(0, L - 1)) + 380;
    const member = (j) => crewStart + j * 125;
    const doodles = crewStart + Math.max(0, C - 1) * 125 * 0.5;
    const copy = crewStart + 240;
    const word = (k) => copy + k * 42;
    const actionsStart = word(W) + 100;
    const action = (k) => actionsStart + k * 105;
    return { ground: 60, letter, crewStart, member, doodles, word, action };
  }

  function estimateMetrics(word) {
    return {
      advances: Array.from(word).map((c) => (c === ' ' ? 0.3 : /[IJ1]/.test(c) ? 0.42 : /[MW]/.test(c) ? 0.98 : 0.76) * FONT_SIZE),
      cap: 0.73 * FONT_SIZE,
    };
  }

  function measureMetrics(word, family) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.font = '900 ' + FONT_SIZE + 'px ' + family;
    const chars = Array.from(word);
    const advances = [];
    let prev = 0;
    for (let i = 0; i < chars.length; i++) {
      const wNow = ctx.measureText(chars.slice(0, i + 1).join('')).width;
      advances.push(wNow - prev);
      prev = wNow;
    }
    const m = ctx.measureText(word.replace(/\s/g, '') || 'H');
    const cap = m.actualBoundingBoxAscent > 0 ? m.actualBoundingBoxAscent : 0.73 * FONT_SIZE;
    return { advances, cap };
  }

  /* =========================================================================
     2. HAND-DRAWN CHARACTER ART & DOODLES (exact SVG geometry)
     ========================================================================= */
  const ACCENT = {
    flame: '#ff7a1a',
    flameCore: '#ffd23f',
    gold: '#F59E0B',
    heart: '#EC4899',
    bread: '#f2c48d',
    leaf: '#10B981',
    beak: '#F59E0B',
    cap: '#EF4444',
    sparkle: '#60A5FA',
  };

  const ART = {
    yeti: {
      k: 1,
      box: { l: -72, r: 60, t: -140, b: 6 },
      seat: 'front',
      eyes: [
        { x: -15, y: -86, r: 8, pupil: 3.6, max: 3.6 },
        { x: 13, y: -88, r: 8, pupil: 3.6, max: 3.6 },
      ],
      body: (hatch) => `
        <ellipse class="dcf-shadow" cx="0" cy="2" rx="54" ry="5" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" fill="${hatch}" stroke="none" />
        <path class="n" d="M-67 -64 C-58 -59 -50 -59 -43 -64" />
        <path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z" />
        <path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z" />
        <path class="n" d="M-38 -124 L-28 -119 M39 -125 L33 -116" />
        <path d="M-44 -2 C-54 -28 -54 -66 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -64 58 -28 48 -2 C30 4 -26 4 -44 -2 Z" />
        <path d="M40 -96 C54 -66 54 -30 46 -4 C40 -2 34 -1 30 0 C40 -30 42 -64 33 -101 Z" fill="${hatch}" stroke="none" />
        <path class="n" d="M-7 -117 C-5 -126 1 -128 3 -120 C5 -127 11 -126 11 -116" />
        <path class="n thin" d="M-14 -24 l-3 4 M8 -40 l3 4 M14 -46 l3 3 M20 -30 l3 3" />
        <path class="n" d="M-48 -62 C-22 -50 10 -32 49 -26 M-50 -52 C-24 -40 8 -22 49 -16" />
        <rect x="-12" y="-46" width="15" height="13" rx="2.5" transform="rotate(26 -4.5 -39.5)" />
        <path d="M-46 -60 C-62 -50 -63 -29 -51 -19 C-45 -15 -38 -19 -40 -28 C-43 -36 -40 -46 -36 -52" />
        <path d="M46 -58 C61 -46 61 -26 51 -18 C45 -14 38 -18 40 -26 C43 -34 41 -44 37 -50" />
        <path d="M-37 -2 C-41 -14 -23 -19 -16 -7 C-14 0 -26 4 -37 -2 Z" />
        <path d="M37 -2 C41 -14 23 -19 16 -7 C14 0 26 4 37 -2 Z" />
        <path class="n thin" d="M-30 -4 l1 -4 M-24 -3 l1 -4 M30 -4 l-1 -4 M24 -3 l-1 -4" />
        <path class="n" d="M-23 -98 L-9 -96 M6 -98 L20 -100" />
        <path class="n" d="M-12 -70 C-6 -64 6 -64 12 -71" />
        <path d="M3 -66.5 L5.5 -60 L8 -67.5 Z" />
      `,
    },
    kid: {
      k: 1.28,
      box: { l: -30, r: 30, t: -88, b: 42 },
      seat: 'top',
      eyes: [
        { x: -6, y: -58, r: 0, pupil: 2.5, max: 1.8 },
        { x: 6.5, y: -58, r: 0, pupil: 2.5, max: 1.8 },
      ],
      body: (hatch) => `
        <path d="M-15 -6 L-3 -6 C-3 8 -5 20 -6 30 L-15 30 C-15 18 -16 6 -15 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" fill="${hatch}" stroke="none" />
        <path class="k" d="M-17 30 C-20 34 -20 40 -14 41 L-2 41 C2 40 0 34 -5 30 Z" />
        <path class="k" d="M11 29 C8 34 10 40 16 40 L26 38 C29 36 27 30 22 27 Z" />
        <path d="M-20 -4 C-22 -20 -18 -38 -10 -44 L10 -44 C18 -38 22 -20 20 -4 Z" />
        <path class="n thick" d="M-19.5 -14 L19.5 -14 M-18.5 -26 L18.5 -26 M-14 -36 L14 -36" />
        <path class="n" d="M-18 -36 C-28 -28 -30 -14 -26 -5" />
        <circle cx="-26" cy="-3" r="4" />
        <path class="n" d="M18 -36 C27 -30 30 -18 28 -7" />
        <circle cx="28" cy="-4" r="4" />
        <circle cx="-17" cy="-58" r="4" />
        <circle cx="17" cy="-58" r="4" />
        <circle cx="0" cy="-60" r="17" />
        <path class="n thin" d="M-11 -52 l2 -2 M-8 -52 l2 -2 M8 -52 l2 -2 M11 -52 l2 -2" />
        <path class="n" d="M-5 -50 C-2 -47 2 -47 5 -50" />
        <path d="M-15 -70 C-14 -87 14 -87 15 -70 Z" />
        <path d="M-27 -68 C-16 -75 16 -75 27 -68 C18 -63 -18 -63 -27 -68 Z" />
        <path class="n thick" d="M-14.5 -74 C-6 -77 6 -77 14.5 -74" />
      `,
    },
    bird: {
      k: 1.22,
      box: { l: -34, r: 30, t: -62, b: 2 },
      seat: 'top',
      idle: 'dcf-peck',
      eyes: [
        { x: 3, y: -30, r: 4.6, pupil: 2.3, max: 2 },
        { x: 12, y: -31, r: 4.6, pupil: 2.3, max: 2 },
      ],
      body: (hatch) => `
        <path class="n" d="M-5 0 L-5 -7 M-9 0 L-1 0 M5 0 L5 -7 M1 0 L9 0" />
        <path d="M-17 -16 C-26 -18 -31 -14 -33 -9 C-26 -10 -20 -8 -15 -10 Z" />
        <path d="M-18 -14 C-20 -30 -10 -40 2 -40 C16 -40 22 -28 20 -16 C18 -6 8 -4 0 -4 C-10 -4 -17 -8 -18 -14 Z" />
        <path d="M-11 -25 C-3 -26 1 -18 -3 -13 C-9 -12 -15 -17 -11 -25 Z" fill="${hatch}" />
        <path class="o" d="M19 -30 L29 -27 L19 -23 Z" />
        <path class="a" d="M-3 -38 L4 -59 L12 -37 Z" />
        <path class="n thin" d="M-1 -44 L10 -46 M1 -51 L8 -52" />
        <circle cx="4" cy="-60" r="2.8" />
      `,
    },
    cat: {
      k: 1.06,
      box: { l: -30, r: 52, t: -110, b: 4 },
      seat: 'front',
      eyes: [{ x: 10, y: -76, r: 6, pupil: 2.8, max: 2.6 }],
      body: (hatch) => `
        <ellipse class="dcf-shadow" cx="4" cy="2" rx="32" ry="4" />
        <g class="dcf-tail">
          <path d="M18 -4 C42 -4 52 -24 46 -44 C44 -51 36 -53 34 -46 C40 -30 34 -16 16 -14 Z" />
          <path class="n thin" d="M40 -16 l5 4 M45 -30 l6 1 M43 -42 l6 -3" />
        </g>
        <path d="M-22 0 C-28 -18 -24 -42 -14 -52 L14 -52 C24 -42 28 -18 22 0 C10 3 -10 3 -22 0 Z" />
        <path d="M14 -46 C24 -36 26 -16 22 0 C18 1 14 2 12 2 C16 -14 16 -32 10 -46 Z" fill="${hatch}" stroke="none" />
        <path class="n" d="M-8 -30 L-9 -1 M8 -30 L9 -1" />
        <path d="M-16 1 C-16 -5 -3 -5 -3 1 Z M3 1 C3 -5 16 -5 16 1 Z" />
        <path class="a" d="M-18 -55 C-6 -49 6 -49 18 -55 L17 -46 C6 -40 -6 -40 -17 -46 Z" />
        <path class="a" d="M9 -45 L18 -32 L6 -37 Z" />
        <path d="M-22 -86 L-25 -107 L-7 -96 Z" />
        <path d="M8 -96 L23 -108 L22 -86 Z" />
        <path class="n thin" d="M-20 -92 L-21 -101 M18 -101 L18 -92" />
        <path d="M-26 -70 C-28 -88 -16 -98 0 -98 C16 -98 28 -88 26 -70 C24 -56 12 -50 0 -50 C-12 -50 -24 -56 -26 -70 Z" />
        <path class="n thin" d="M-4 -97 L-3 -90 M3 -97 L3 -91" />
        <path class="n" d="M-26 -80 C-14 -83 4 -87 25 -93" />
        <ellipse class="k" cx="-10" cy="-76" rx="7.5" ry="6.5" />
        <path class="k" d="M-2.5 -68 L2.5 -68 L0 -64.5 Z" />
        <path class="n" d="M0 -64.5 C-1 -60.5 -5 -60.5 -6 -62.5 M0 -64.5 C1 -60.5 5 -60.5 6 -62.5" />
        <path class="n thin" d="M-15 -66 L-29 -68 M-15 -63 L-28 -59 M15 -66 L29 -68 M15 -63 L28 -59" />
      `,
    },
    ghost: {
      k: 1.3,
      box: { l: -26, r: 26, t: -70, b: 0 },
      seat: 'behind',
      idle: 'dcf-bob',
      eyes: [
        { x: -8, y: -44, r: 6.5, pupil: 3.2, max: 3 },
        { x: 9, y: -44, r: 6.5, pupil: 3.2, max: 3 },
      ],
      body: (hatch) => `
        <path d="M-23 -14 L-23 -40 C-23 -59 -12 -67 0 -67 C12 -67 23 -59 23 -40 L23 -14 C12 -10 -12 -10 -23 -14 Z" />
        <path d="M13 -61 C21 -54 23 -46 23 -36 L23 -15 L15 -13 L15 -36 C15 -46 15 -54 13 -61 Z" fill="${hatch}" stroke="none" />
        <path class="n thin" d="M-16 -56 C-12 -61 -6 -63 -2 -63" />
        <path class="k" d="M-5 -33 C-3 -27 4 -27 6 -33 Z" />
        <path class="n thin" d="M-17 -35 l3 -2 M-14 -34 l3 -2 M14 -35 l3 -2 M17 -34 l3 -2" />
      `,
      front: () => `
        <path d="M-25 -32 C-27 -38 -21 -42 -17 -38 C-15 -42 -10 -41 -10 -36 L-11 -30 C-15 -28 -22 -28 -25 -32 Z" />
        <path d="M25 -32 C27 -38 21 -42 17 -38 C15 -42 10 -41 10 -36 L11 -30 C15 -28 22 -28 25 -32 Z" />
      `,
    },
    mushroom: {
      k: 1.12,
      box: { l: -27, r: 27, t: -56, b: 4 },
      seat: 'front',
      idle: 'dcf-sway',
      eyes: [
        { x: -4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
        { x: 4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
      ],
      body: (hatch) => `
        <ellipse class="dcf-shadow" cx="0" cy="2" rx="18" ry="3" />
        <path class="n" d="M-10 -15 L-17 -9 M10 -15 L17 -11" />
        <path d="M-10 0 C-12 -10 -10 -22 -8 -28 L8 -28 C10 -22 12 -10 10 0 C4 2 -4 2 -10 0 Z" />
        <path d="M5 -27 C9 -20 11 -10 10 0 C8 1 6 1.5 4 1.5 C6 -8 6 -18 2 -27 Z" fill="${hatch}" stroke="none" />
        <path class="r" d="M-25 -28 C-27 -45 -12 -55 0 -55 C12 -55 27 -45 25 -28 C14 -23 -14 -23 -25 -28 Z" />
        <circle cx="-12" cy="-40" r="4.2" />
        <circle cx="6" cy="-46" r="3.4" />
        <circle cx="15" cy="-34" r="3" />
        <circle cx="-2" cy="-33" r="2.4" />
        <path class="n" d="M-2 -10 C-1 -8 1 -8 2 -10" />
      `,
    },
  };

  function doodleSvgInner(kind) {
    switch (kind) {
      case 'flame':
        return `<path fill="${ACCENT.flame}" d="M0 14 C-9 14 -12 6 -10 0 C-8 -5 -4 -6 -4 -12 C1 -9 3 -5 2 -1 C4 -3 5 -6 5 -8 C10 -3 11 4 8 9 C6 12 3 14 0 14 Z" />
                <path fill="${ACCENT.flameCore}" d="M0 11.5 C-4 11.5 -6 8 -5 5 C-4 2 -1 1 -1 -3 C2 -1 4 3 3 6 C4 5 5 4 5 3 C7 6 5 11.5 0 11.5 Z" />`;
      case 'sandwich':
        return `<path fill="${ACCENT.bread}" d="M-13 5 L13 5 L12.5 9.5 C4 11 -4 11 -12.5 9.5 Z" />
                <path fill="${ACCENT.gold}" d="M-12 2 L12 2 L11 5 L5 5 L3 9 L1 5 L-12 5 Z" />
                <path fill="none" stroke="${ACCENT.leaf}" stroke-width="2.6" d="M-13 1 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0 q2.2 2.4 4.4 0" />
                <path fill="${ACCENT.bread}" d="M-13 -1 C-14 -8 -10 -11 -6 -10 C-3 -13.5 3 -13.5 6 -10 C10 -11 14 -8 13 -1 Z" />
                <path fill="none" stroke-width="1.2" d="M-6 -6 l1.5 -1 M0 -8 l1.5 -1 M6 -6 l1.5 -1" />`;
      case 'star':
        return `<path fill="${ACCENT.gold}" d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z" />`;
      case 'heart':
        return `<path fill="${ACCENT.heart}" d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z" />`;
      case 'bolt':
        return `<path fill="${ACCENT.gold}" d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z" />`;
      case 'sparkle':
        return `<path fill="${ACCENT.sparkle}" d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z" />`;
      case 'spiral':
        return `<path fill="none" d="M0 0 C2 -2 4 0 3 3 C1 6 -4 5 -5 1 C-6 -4 -1 -8 4 -7 C9 -5 10 2 7 6" />`;
      case 'plane':
        return `<path class="dcf-paperfill" d="M-13 -1 L13 -10 L4 12 L0 3 Z" />
                <path fill="none" d="M0 3 L13 -10 M0 3 L-2 9 L2 5" />`;
      default:
        return '';
    }
  }

  /* =========================================================================
     3. STYLESHEET (Matched to GuruStudy Midnight Indigo #060B19 Main Site Theme)
     ========================================================================= */
  const DCF_CSS = `
    .dcf {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      overflow: clip;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background:
        radial-gradient(ellipse 70% 45% at 50% 62%, rgba(99, 102, 241, 0.16) 0%, transparent 70%),
        radial-gradient(ellipse 40% 35% at 15% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 65%),
        radial-gradient(ellipse 45% 35% at 85% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 65%),
        var(--dcf-bg);
      color: var(--dcf-ink);
      font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Inter, Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      --dcf-bg: #060B19;
      --dcf-ink: #F8FAFC;
      --dcf-accent: #6366F1;
      --dcf-accent-2: #F59E0B;
      --dcf-soft: #94A3B8;
      --dcf-line: rgba(255, 255, 255, 0.12);
      --dcf-serif: ${DEFAULT_SERIF};
      --dcf-display: ${DEFAULT_FONT};
      --dcf-pad: clamp(16px, 4vw, 56px);
      border-top: 1px solid rgba(99, 102, 241, 0.22);
      margin-top: 64px;
      padding: 0;
    }
    .dcf *, .dcf *::before, .dcf *::after { box-sizing: border-box; }
    .dcf a { color: inherit; text-decoration: none; }
    .dcf button { appearance: none; background: none; border: 0; padding: 0; margin: 0; font: inherit; color: inherit; cursor: pointer; }
    .dcf h2, .dcf h3, .dcf p, .dcf ul { margin: 0; padding: 0; }
    .dcf ul { list-style: none; }
    .dcf svg { max-width: none; overflow: visible; }
    .dcf :focus-visible { outline: 2px dashed var(--dcf-accent); outline-offset: 4px; border-radius: 6px; }
    .dcf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

    /* Top Band */
    .dcf-top {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 2fr);
      grid-template-rows: auto 1fr;
      column-gap: clamp(24px, 5vw, 80px);
      row-gap: 14px;
      padding: clamp(36px, 5vw, 60px) var(--dcf-pad) 0;
      max-width: 1360px;
      width: 100%;
      margin: 0 auto;
      position: relative;
      z-index: 3;
    }
    .dcf-brand { display: flex; align-items: center; gap: 12px; grid-column: 1; grid-row: 1; }
    .dcf-logo {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      border: 2px solid rgba(165, 180, 252, 0.85);
      background: rgba(15, 23, 42, 0.9);
      box-shadow: 0 0 18px rgba(99, 102, 241, 0.35);
      transform: rotate(-6deg);
      transition: transform .35s cubic-bezier(.3, 1.6, .5, 1);
      overflow: hidden;
      flex-shrink: 0;
    }
    .dcf-logo img { width: 32px; height: 32px; border-radius: 999px; object-fit: cover; }
    .dcf-brand:hover .dcf-logo { transform: rotate(8deg) scale(1.08); }
    .dcf-brandname {
      font-weight: 800;
      font-size: 21px;
      letter-spacing: -.025em;
      background: linear-gradient(135deg, #FFFFFF 0%, #A5B4FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .dcf-blurb {
      grid-column: 1;
      grid-row: 2;
      font-family: var(--dcf-serif);
      font-size: 15px;
      line-height: 1.6;
      color: var(--dcf-soft);
      max-width: 36ch;
    }
    .dcf-cols {
      grid-column: 2;
      grid-row: 1 / span 2;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
    }
    .dcf-coltitle {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #A5B4FC;
      margin-bottom: 12px;
    }
    .dcf-col li { margin: 0 0 8px; }
    .dcf-link {
      position: relative;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      color: var(--dcf-soft);
      padding: 2px 0;
      transition: color .2s;
    }
    .dcf-link:hover { color: var(--dcf-ink); }
    .dcf-squiggle {
      position: absolute;
      left: -2px;
      right: -2px;
      bottom: -4px;
      width: calc(100% + 4px);
      height: 7px;
      pointer-events: none;
    }
    .dcf-squiggle path {
      fill: none;
      stroke: var(--dcf-accent);
      stroke-width: 2.3;
      stroke-linecap: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      transition: stroke-dashoffset .35s cubic-bezier(.4, 0, .2, 1);
    }
    .dcf-link:hover .dcf-squiggle path,
    .dcf-link:focus-visible .dcf-squiggle path { stroke-dashoffset: 0; }

    /* Sketchbook World */
    .dcf-world {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: clamp(28px, 4.5vw, 52px) var(--dcf-pad) 0;
      max-width: 1360px;
      width: 100%;
      margin: 0 auto;
    }
    .dcf-stage { position: relative; z-index: 1; }
    .dcf-svg { display: block; width: 100%; height: auto; user-select: none; -webkit-user-select: none; }
    .dcf-svg text { fill: var(--dcf-ink); }
    .dcf-art { fill: var(--dcf-bg); stroke: var(--dcf-ink); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .dcf-art .n { fill: none; }
    .dcf-art .k { fill: var(--dcf-ink); }
    .dcf-art .a { fill: var(--dcf-accent); }
    .dcf-art .o { fill: #F59E0B; }
    .dcf-art .r { fill: #EF4444; }
    .dcf-art .thin { stroke-width: 1.5; }
    .dcf-art .thick { stroke-width: 3.4; }
    .dcf-art .dcf-glint { fill: var(--dcf-bg); stroke: none; }
    .dcf-art .dcf-shadow { fill: #6366F1; stroke: none; opacity: .28; }
    .dcf-ground path { fill: none; stroke: rgba(165, 180, 252, 0.75); stroke-width: 2.4; stroke-linecap: round; }
    .dcf-ground .dcf-tufts { stroke-width: 1.8; stroke: rgba(16, 185, 129, 0.75); }
    .dcf-pebble { fill: var(--dcf-bg); stroke: rgba(165, 180, 252, 0.7); stroke-width: 1.6; }
    .dcf-dust { fill: none; stroke: #A5B4FC; stroke-width: 3; stroke-linecap: round; opacity: 0; }
    .dcf-hit { fill: transparent; stroke: none; cursor: pointer; outline: none; }
    .dcf-hit:focus-visible { stroke: var(--dcf-accent); stroke-width: 2.5; stroke-dasharray: 6 6; }
    .dcf-glyph { transform-box: fill-box; transform-origin: 50% 100%; }
    .dcf[data-interactive='1'] .dcf-glyph:hover { animation: dcf-jiggle .6s cubic-bezier(.3, 1.5, .5, 1); }
    .dcf-art.dcf-bob { animation: dcf-bob 3.2s ease-in-out infinite; }
    .dcf-art.dcf-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: dcf-swing 4s ease-in-out infinite; }
    .dcf-art.dcf-peck { transform-box: fill-box; transform-origin: 50% 100%; animation: dcf-peck 5.5s ease-in-out infinite; }
    .dcf-tail { transform-box: fill-box; transform-origin: 0% 100%; animation: dcf-tail 2.8s ease-in-out infinite; }
    .dcf-hopper { transform-box: fill-box; transform-origin: 50% 100%; }
    .dcf-hopper.is-hop { animation: dcf-hop .62s cubic-bezier(.3, .7, .4, 1); }
    .dcf-arrive { transform-box: fill-box; transform-origin: 50% 100%; }

    /* Comic Speech Bubbles */
    .dcf-bubbles { position: absolute; inset: 0; pointer-events: none; z-index: 4; }
    .dcf-bubble {
      position: absolute;
      transform: translate(-50%, -100%) rotate(-2deg);
      transform-origin: 50% 100%;
      background: #0F172A;
      color: #F8FAFC;
      border: 2px solid #A5B4FC;
      border-radius: 16px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
      white-space: nowrap;
      box-shadow: 3px 3px 0 var(--dcf-accent), 0 10px 24px rgba(0, 0, 0, 0.55);
      animation: dcf-bubble .32s cubic-bezier(.3, 1.6, .5, 1) both;
      margin-top: -6px;
    }
    .dcf-bubble::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -9px;
      width: 14px;
      height: 14px;
      background: #0F172A;
      border-right: 2px solid #A5B4FC;
      border-bottom: 2px solid #A5B4FC;
      transform: translateX(-50%) rotate(45deg) skew(8deg, 8deg);
    }
    .dcf-bubble.is-left { transform: translate(-86%, -100%) rotate(2deg); transform-origin: 86% 100%; }
    .dcf-bubble.is-left::after { left: 86%; }

    /* Floating Interactive Doodles */
    .dcf-doodles { position: absolute; inset: 0; pointer-events: none; z-index: 2; overflow: hidden; }
    .dcf-doodle { position: absolute; left: 0; top: 0; pointer-events: auto; cursor: pointer; will-change: transform; touch-action: manipulation; }
    .dcf-doodle-in { display: block; width: 100%; height: 100%; }
    .dcf[data-interactive='0'] .dcf-doodle { pointer-events: none; }
    .dcf-doodle svg, .dcf-icon { display: block; stroke: var(--dcf-ink); stroke-width: 1.9; stroke-linejoin: round; stroke-linecap: round; }
    .dcf-doodle svg { width: 100%; height: 100%; filter: drop-shadow(0 2px 6px rgba(99, 102, 241, 0.35)); }
    .dcf-paperfill { fill: #1E293B; }

    /* Tagline & Action Pills */
    .dcf-cta {
      position: relative;
      z-index: 3;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: clamp(22px, 3vw, 36px) 0 clamp(30px, 4vw, 48px);
      text-align: center;
    }
    .dcf-tagline {
      font-family: var(--dcf-serif);
      font-size: clamp(17px, 2vw, 22px);
      line-height: 1.45;
      letter-spacing: -.005em;
      color: #E2E8F0;
      max-width: 46ch;
      text-wrap: balance;
    }
    .dcf-word { display: inline-block; white-space: pre; }
    .dcf-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
    .dcf-btn {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px;
      height: 46px;
      padding: 0 22px 0 18px;
      border-radius: 9999px;
      border: 2px solid #A5B4FC;
      font-size: 14.5px;
      font-weight: 700;
      letter-spacing: -.01em;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      box-shadow: 0 3px 0 #4F46E5;
      transition: transform .18s cubic-bezier(.3, 1.4, .5, 1), box-shadow .18s cubic-bezier(.3, 1.4, .5, 1);
    }
    .dcf-btn.is-outline {
      background: rgba(15, 23, 42, 0.85);
      color: #F8FAFC;
      backdrop-filter: blur(10px);
    }
    .dcf-btn.is-solid {
      background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
      color: #FFFFFF;
      border-color: #818CF8;
      box-shadow: 0 3px 0 #F59E0B, 0 8px 24px rgba(99, 102, 241, 0.4);
    }
    .dcf-btn.is-solid .dcf-icon { stroke: #FFFFFF; }
    .dcf-btn:hover { transform: translateY(-2px) rotate(-1.2deg); box-shadow: 0 5px 0 #4F46E5; }
    .dcf-btn.is-solid:hover { box-shadow: 0 5px 0 #F59E0B, 0 12px 28px rgba(99, 102, 241, 0.55); }
    .dcf-btn:active { transform: translateY(2px); box-shadow: 0 1px 0 #4F46E5; transition-duration: .06s; }
    .dcf-btn:hover .dcf-icon { animation: dcf-wiggle .5s ease-in-out; }

    /* Bottom Bar */
    .dcf-bar {
      position: relative;
      z-index: 3;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 24px;
      padding: 18px var(--dcf-pad) 26px;
      max-width: 1360px;
      width: 100%;
      margin: 0 auto;
      border-top: 1.5px dashed var(--dcf-line);
      font-size: 13px;
    }
    .dcf-copy { color: var(--dcf-soft); margin-right: auto; }
    .dcf-inline { display: flex; flex-wrap: wrap; gap: 6px 18px; }
    .dcf-inline .dcf-link { font-size: 13px; }
    .dcf-socials .dcf-link { color: #E2E8F0; font-weight: 700; }
    .dcf-totop {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1.5px solid rgba(165, 180, 252, 0.7);
      background: rgba(15, 23, 42, 0.7);
      color: #F8FAFC;
      white-space: nowrap !important;
      flex-shrink: 0 !important;
      transition: transform .2s cubic-bezier(.3, 1.5, .5, 1), border-color .2s;
    }
    .dcf-totop svg { fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .dcf-totop:hover { transform: translateY(-2px); border-color: #6366F1; }
    .dcf-totop:hover svg { animation: dcf-up .6s ease-in-out infinite; }

    /* Storyboard Transitions */
    .dcf[data-play='0'] .dcf-letter,
    .dcf[data-play='0'] .dcf-arrive,
    .dcf[data-play='0'] .dcf-word,
    .dcf[data-play='0'] .dcf-pop,
    .dcf[data-play='0'] .dcf-rise,
    .dcf[data-play='0'] .dcf-fade,
    .dcf[data-play='0'] .dcf-doodle-in { opacity: 0; }
    .dcf[data-play='0'] .dcf-draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .dcf-letter { transform-box: fill-box; transform-origin: 50% 100%; }
    .dcf[data-play='1'] .dcf-letter { animation: dcf-stamp .62s cubic-bezier(.2, .8, .25, 1.15) var(--d) both; }
    .dcf[data-play='1'] .dcf-dust { animation: dcf-dust .5s ease-out calc(var(--d) + .22s) both; }
    .dcf[data-play='1'] .dcf-draw { stroke-dasharray: 1; animation: dcf-draw 1.1s cubic-bezier(.6, 0, .3, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-fade { animation: dcf-fade .6s ease-out var(--d) both; }
    .dcf[data-play='1'] .dcf-arrive-front { animation: dcf-rise-up .75s cubic-bezier(.3, 1.5, .5, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-arrive-top { animation: dcf-plop .8s cubic-bezier(.3, .9, .4, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-arrive-behind { animation: dcf-peek .9s cubic-bezier(.3, 1.4, .5, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-word { animation: dcf-word .6s cubic-bezier(.2, .8, .3, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-pop { animation: dcf-popin .55s cubic-bezier(.3, 1.6, .5, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-rise { animation: dcf-fadeup .7s cubic-bezier(.2, .8, .3, 1) var(--d) both; }
    .dcf[data-play='1'] .dcf-doodle-in { animation: dcf-fade .6s ease-out var(--d) both; }

    @keyframes dcf-stamp {
      0% { opacity: 0; transform: translateY(-34%) scale(1.28) rotate(var(--r)); }
      55% { opacity: 1; transform: translateY(2%) scale(.95, 1.05) rotate(0deg); }
      75% { transform: translateY(0) scale(1.04, .95); }
      100% { opacity: 1; transform: none; }
    }
    @keyframes dcf-dust {
      0% { opacity: 0; stroke-dasharray: 0 40; }
      30% { opacity: .9; }
      100% { opacity: 0; stroke-dasharray: 14 40; stroke-dashoffset: -16; }
    }
    @keyframes dcf-draw { to { stroke-dashoffset: 0; } }
    @keyframes dcf-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dcf-rise-up {
      0% { opacity: 0; transform: translateY(30%) scale(.7, .3); }
      45% { opacity: 1; transform: translateY(-8%) scale(.92, 1.12); }
      70% { transform: translateY(0) scale(1.08, .92); }
      100% { opacity: 1; transform: none; }
    }
    @keyframes dcf-plop {
      0% { opacity: 0; transform: translateY(-90%); }
      50% { opacity: 1; transform: translateY(0) scale(1.1, .86); }
      68% { transform: translateY(-10%) scale(.96, 1.04); }
      84% { transform: translateY(0) scale(1.03, .97); }
      100% { opacity: 1; transform: none; }
    }
    @keyframes dcf-peek {
      0% { opacity: 0; transform: translateY(55%); }
      60% { opacity: 1; transform: translateY(-6%); }
      100% { opacity: 1; transform: none; }
    }
    @keyframes dcf-word { from { opacity: 0; transform: translateY(.6em) rotate(3deg); } to { opacity: 1; transform: none; } }
    @keyframes dcf-popin { 0% { opacity: 0; transform: translateY(10px) scale(.6) rotate(-4deg); } 100% { opacity: 1; transform: none; } }
    @keyframes dcf-fadeup { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    @keyframes dcf-jiggle {
      0% { transform: none; }
      25% { transform: rotate(-4deg) scale(1.03, .97); }
      50% { transform: rotate(3deg) translateY(-3%); }
      75% { transform: rotate(-1.5deg); }
      100% { transform: none; }
    }
    @keyframes dcf-hop {
      0% { transform: none; }
      18% { transform: scale(1.12, .84); }
      45% { transform: translateY(-28%) scale(.94, 1.08); }
      72% { transform: translateY(0) scale(1.1, .88); }
      86% { transform: scale(.97, 1.03); }
      100% { transform: none; }
    }
    @keyframes dcf-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes dcf-swing { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2.5deg); } }
    @keyframes dcf-peck { 0%, 62%, 100% { transform: none; } 66% { transform: rotate(14deg) translateY(2px); } 70% { transform: none; } 74% { transform: rotate(12deg) translateY(2px); } 78% { transform: none; } }
    @keyframes dcf-tail { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-12deg); } }
    @keyframes dcf-bubble { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }
    @keyframes dcf-wiggle { 0%, 100% { transform: none; } 30% { transform: rotate(-14deg) scale(1.15); } 60% { transform: rotate(10deg); } }
    @keyframes dcf-up { 0%, 100% { transform: none; } 50% { transform: translateY(-3px); } }

    @media (max-width: 860px) {
      .dcf-top { grid-template-columns: 1fr; grid-template-rows: auto; }
      .dcf-brand, .dcf-blurb, .dcf-cols { grid-column: 1; grid-row: auto; }
      .dcf-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 14px; row-gap: 22px; }
      .dcf-copy { width: 100%; margin-right: 0; }
    }
    @media (max-width: 480px) {
      .dcf-btn { height: 42px; font-size: 13.5px; padding: 0 16px 0 13px; }
      .dcf-bubble { font-size: 11.5px; padding: 6px 10px; }
      .dcf-totop span { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .dcf *, .dcf *::before, .dcf *::after { animation: none !important; transition: none !important; }
      .dcf .dcf-letter, .dcf .dcf-arrive, .dcf .dcf-word, .dcf .dcf-pop, .dcf .dcf-rise, .dcf .dcf-fade, .dcf .dcf-doodle-in { opacity: 1 !important; }
      .dcf .dcf-draw { stroke-dashoffset: 0 !important; }
      .dcf .dcf-dust { opacity: 0 !important; }
    }
  `;

  /* =========================================================================
     4. GURUSTUDY CONFIGURATION & MOUNTING ENGINE
     ========================================================================= */
  const GURU_CREW = [
    { kind: 'yeti', letter: 0, seat: 'front', offset: -0.32, name: 'Bruno', says: 'Time for Class 10 Maths! 2h focus!' },
    { kind: 'bird', letter: 1, seat: 'top', offset: 0.02, name: 'Pip', says: 'Keep your 88-day streak alive!' },
    { kind: 'mushroom', letter: 3, seat: 'front', offset: 0.12, scale: 0.95, name: 'Morel', says: 'NCERT Science One-Shots ready!' },
    { kind: 'kid', letter: 5, seat: 'top', offset: -0.05, name: 'Juno', says: '95%+ Board Target! Best seat up here!' },
    { kind: 'ghost', letter: 7, seat: 'behind', offset: 0, name: 'Boo', says: 'Boo! Revised SST Map Work yet?' },
    { kind: 'cat', letter: 8, seat: 'front', offset: 0.42, flip: true, name: 'Patch', says: 'Sunday 6.5h + AI 417 Boost! Nice cursor.' },
  ];

  const GURU_DOODLES = ['flame', 'star', 'bolt', 'sparkle', 'sandwich', 'heart', 'plane', 'spiral'];

  const GURU_COLUMNS = [
    {
      title: 'Applications',
      links: [
        { label: 'Launch Web App', href: '/app/' },
        { label: 'Download APK (v2.1)', href: '/downloads/GuruStudy-v1.0.apk', download: true },
        { label: '88-Day Blueprint', href: '#routine-explorer' },
        { label: 'NCERT Lectures', href: '#syllabus-preview' },
      ],
    },
    {
      title: 'Class 10 Subjects',
      links: [
        { label: 'Mathematics (14 Ch)', href: '/app/#books' },
        { label: 'Science (13 Ch)', href: '/app/#books' },
        { label: 'Social Science (21 Ch)', href: '/app/#books' },
        { label: 'AI Code 417 (Sunday)', href: '/app/#books' },
      ],
    },
    {
      title: 'HarshGuruJi Ecosystem',
      links: [
        { label: 'WebGuruJi Online', href: 'https://webguruji.online', external: true },
        { label: 'GuruStore Products', href: 'https://store.webguruji.online', external: true },
        { label: 'NCERT Digital Books', href: 'https://books.webguruji.online', external: true },
        { label: 'Guru AI Tools', href: 'https://ai.webguruji.online', external: true },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'contact@webguruji.online', href: 'mailto:contact@webguruji.online' },
        { label: 'Student FAQ', href: '#faq' },
        { label: 'Privacy Policy', href: '/docs/PRIVACY_POLICY_AND_PERMISSIONS.md' },
        { label: 'Play Store Spec', href: '/docs/PLAY_STORE_LISTING.md' },
      ],
    },
  ];

  const GURU_LEGAL = [
    { label: 'Privacy', href: '/docs/PRIVACY_POLICY_AND_PERMISSIONS.md' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Offline Ready', href: '/app/' },
  ];

  const GURU_SOCIALS = [
    { label: 'WebGuruJi', href: 'https://webguruji.online', external: true },
    { label: 'GuruStore', href: 'https://store.webguruji.online', external: true },
    { label: 'Books', href: 'https://books.webguruji.online', external: true },
    { label: 'AI Tools', href: 'https://ai.webguruji.online', external: true },
  ];

  function renderLinkHtml(l) {
    const targetAttr = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const dlAttr = l.download ? ' download' : '';
    return `<a class="dcf-link" href="${l.href}"${targetAttr}${dlAttr}>
      <span>${l.label}</span>
      <svg class="dcf-squiggle" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M1 5 C10 1 16 7 25 4 S40 1 50 4 S66 7 75 4 S90 1 99 4" />
      </svg>
    </a>`;
  }

  function mountGuruDoodleFooter(containerId) {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(containerId);
    if (!target) return;

    // Inject scoped styles once
    if (!document.getElementById('dcf-gurustudy-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'dcf-gurustudy-styles';
      styleEl.textContent = DCF_CSS;
      document.head.appendChild(styleEl);
    }

    const uid = 'dcfgs';
    const wordmark = 'GURUSTUDY';
    const chars = Array.from(wordmark);
    const tracking = -0.025;
    const tagline = 'An 88-day hand-crafted study mission for the Class 10 topper in all of us.';
    const words = tagline.split(/\s+/).filter(Boolean);
    const doodleCount = 12;

    const metrics = measureMetrics(wordmark, DEFAULT_FONT) || estimateMetrics(wordmark);
    const layout = layoutWord(metrics.advances, tracking, FONT_SIZE);
    const cap = metrics.cap;

    const placed = GURU_CREW.map((m, i) => {
      const art = ART[m.kind];
      if (!art) return null;
      const li = clamp(Math.floor(m.letter) || 0, 0, chars.length - 1);
      const scale = (cap / 144) * art.k * (m.scale || 1);
      const seat = m.seat || art.seat;
      const p = seatPoint(seat, layout.x[li], layout.w[li], cap, m.offset || 0, scale);
      return { i, m, art, seat, scale, x: p.x, y: p.y, flip: m.flip ? -1 : 1 };
    }).filter(Boolean);

    // Compute SVG viewBox
    let l = 0;
    let r = layout.width;
    let t = -cap;
    let b = 30;
    for (const p of placed) {
      const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l];
      l = Math.min(l, p.x + bx[0] * p.scale);
      r = Math.max(r, p.x + bx[1] * p.scale);
      t = Math.min(t, p.y + p.art.box.t * p.scale);
      b = Math.max(b, p.y + p.art.box.b * p.scale);
    }
    const pad = 26;
    const view = { x: l - pad, y: t - pad, w: r - l + pad * 2, h: b - t + pad * 2 };

    const tl = timeline(chars.length, placed.length, words.length, 2);

    // Sketchy ground path, grass tufts & pebbles
    const x0 = view.x + 6;
    const x1 = view.x + view.w - 6;
    let groundD = 'M' + x0.toFixed(1) + ' 6';
    const segs = 14;
    for (let k = 1; k <= segs; k++) {
      const gx = x0 + ((x1 - x0) * k) / segs;
      groundD +=
        ' Q' +
        (gx - (x1 - x0) / segs / 2).toFixed(1) +
        ' ' +
        (6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1) +
        ' ' +
        gx.toFixed(1) +
        ' ' +
        (6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1);
    }
    let tufts = '';
    for (let k = 0; k < 24; k++) {
      const tx = x0 + 20 + hash(k * 11.3) * (x1 - x0 - 40);
      const ts = 0.7 + hash(k * 5.9) * 0.6;
      tufts +=
        'M' + tx.toFixed(1) + ' 6 l' + (2 * ts).toFixed(1) + ' ' + (-9 * ts).toFixed(1) +
        ' M' + (tx + 3 * ts).toFixed(1) + ' 6 l' + (1 * ts).toFixed(1) + ' ' + (-12 * ts).toFixed(1) +
        ' M' + (tx + 6 * ts).toFixed(1) + ' 6 l' + (-1 * ts).toFixed(1) + ' ' + (-7 * ts).toFixed(1) + ' ';
    }
    const pebblesHtml = Array.from({ length: 10 }, (_, k) => {
      const px = x0 + 40 + hash(k * 17.1) * (x1 - x0 - 80);
      const py = 14 + hash(k * 2.3) * 8;
      const pr = 2 + hash(k * 9.4) * 2.6;
      return `<ellipse class="dcf-pebble dcf-fade" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(pr * 1.5).toFixed(1)}" ry="${pr.toFixed(1)}" style="--d:${tl.ground + 600}ms" />`;
    }).join('');

    const hatch = `url(#${uid}-hatch)`;

    function renderCrewHtml(p, part) {
      const eyesHtml =
        part === 'body'
          ? p.art.eyes
              .map(
                (eye, e) => `
          <g data-crew-blink="${p.i}-${e}">
            ${eye.r > 0 ? `<circle cx="${eye.x}" cy="${eye.y}" r="${eye.r}" />` : ''}
            <g data-crew-pupil="${p.i}-${e}">
              <circle class="k" cx="${eye.x}" cy="${eye.y}" r="${eye.pupil}" />
              <circle class="dcf-glint" cx="${(eye.x + eye.pupil * 0.35).toFixed(2)}" cy="${(eye.y - eye.pupil * 0.4).toFixed(2)}" r="${(eye.pupil * 0.32).toFixed(2)}" />
            </g>
          </g>`
              )
              .join('')
          : '';

      const artInner = part === 'body' ? p.art.body(hatch) + eyesHtml : p.art.front ? p.art.front() : '';

      return `
        <g transform="translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${(p.scale * p.flip).toFixed(4)} ${p.scale.toFixed(4)})">
          <g class="dcf-arrive dcf-arrive-${p.seat}" style="--d:${tl.member(p.i)}ms">
            <g class="dcf-hopper" data-crew-hop="${p.i}">
              <g class="dcf-art${p.art.idle ? ' ' + p.art.idle : ''}" style="--i:${p.i}">
                ${artInner}
              </g>
            </g>
          </g>
        </g>
      `;
    }

    const lettersHtml = chars
      .map((c, i) => {
        if (c === ' ') return '';
        const rot = ((hash(i * 2.3) - 0.5) * 9).toFixed(2) + 'deg';
        const lx = layout.x[i];
        const lw = layout.w[i];
        const dustD = `M${(lx - 6).toFixed(1)} -6 l-16 -6 M${(lx - 4).toFixed(1)} -16 l-12 -12 M${(lx + lw + 6).toFixed(1)} -6 l16 -6 M${(lx + lw + 4).toFixed(1)} -16 l12 -12`;
        return `
          <g class="dcf-letter" style="--d:${tl.letter(i)}ms; --r:${rot}">
            <g class="dcf-glyph">
              <text x="${lx.toFixed(1)}" y="0" font-size="${FONT_SIZE}" font-weight="900" style="font-family:${DEFAULT_FONT}" filter="url(#${uid}-ink)">${c}</text>
            </g>
            <path class="dcf-dust" d="${dustD}" />
          </g>
        `;
      })
      .join('');

    const hitRectsHtml = placed
      .map((p) => {
        const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l];
        const top = p.art.box.t;
        const bottom = p.seat === 'behind' ? -30 : p.art.box.b;
        const x = p.x + bx[0] * p.scale;
        const y = p.y + top * p.scale;
        const w = (bx[1] - bx[0]) * p.scale;
        const h = (bottom - top) * p.scale;
        return `<rect class="dcf-hit" data-crew-hit="${p.i}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="12" role="button" tabindex="0" aria-label="${p.m.name}: ${p.m.says}" />`;
      })
      .join('');

    const doodleList = Array.from({ length: doodleCount }, (_, k) => ({
      kind: GURU_DOODLES[k % GURU_DOODLES.length],
      size: 22 + hash(k * 4.7) * 14,
      seed: k,
    }));

    const doodlesHtml = doodleList
      .map(
        (d, k) => `
      <div class="dcf-doodle" data-doodle-idx="${k}" style="width:${d.size.toFixed(1)}px; height:${d.size.toFixed(1)}px; margin-left:${(-d.size / 2).toFixed(1)}px; margin-top:${(-d.size / 2).toFixed(1)}px;">
        <span class="dcf-doodle-in" style="--d:${Math.round(tl.doodles + k * 70)}ms">
          <svg viewBox="-16 -16 32 32" width="${d.size.toFixed(1)}" height="${d.size.toFixed(1)}">
            ${doodleSvgInner(d.kind)}
          </svg>
        </span>
      </div>`
      )
      .join('');

    const columnsHtml = GURU_COLUMNS.map(
      (col) => `
      <div class="dcf-col">
        <h3 class="dcf-coltitle">${col.title}</h3>
        <ul>
          ${col.links.map((lk) => `<li>${renderLinkHtml(lk)}</li>`).join('')}
        </ul>
      </div>`
    ).join('');

    const wordsHtml = words
      .map((w, k) => `<span class="dcf-word" style="--d:${tl.word(k)}ms">${w} </span>`)
      .join('');

    // Build full Footer HTML
    target.className = 'dcf';
    target.setAttribute('data-play', '0');
    target.setAttribute('data-interactive', '1');
    target.style.minHeight = '720px';

    target.innerHTML = `
      <div class="dcf-top dcf-rise" style="--d:0ms">
        <div class="dcf-brand">
          <span class="dcf-logo" aria-hidden="true">
            <img src="/gurustudy_logo.png" alt="GuruStudy" onerror="this.src='/icon-192.png'" />
          </span>
          <span class="dcf-brandname">GuruStudy</span>
        </div>
        <p class="dcf-blurb">
          The official CBSE Class 10 88-Day Board Exam preparation platform by HarshGuruJi. Smart voice alarms, NCERT teacher lectures, and 5-hour daily discipline.
        </p>
        <nav class="dcf-cols" aria-label="Footer">
          ${columnsHtml}
        </nav>
      </div>

      <div class="dcf-world" id="${uid}-world">
        <div class="dcf-stage">
          <h2 class="dcf-sr">${wordmark}</h2>
          <svg id="${uid}-svg" class="dcf-svg" viewBox="${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}" role="group" aria-label="GURUSTUDY — meet the study crew">
            <defs>
              <pattern id="${uid}-hatch" width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="4.6" stroke="#F8FAFC" stroke-opacity="0.7" stroke-width="1.25" />
              </pattern>
              ${[0, 1, 2]
                .map(
                  (k) => `
                <filter id="${uid}-boil${k}" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${k * 7 + 3}" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
                </filter>`
                )
                .join('')}
              <filter id="${uid}-ink" x="-4%" y="-6%" width="108%" height="112%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="11" result="edge" />
                <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
                <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="2" seed="4" result="streak" />
                <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 5.6" result="streakA" />
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9" result="speck" />
                <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 7.0" result="speckA" />
                <feComposite in="streakA" in2="speckA" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="holes" />
                <feComposite in="rough" in2="holes" operator="out" />
              </filter>
            </defs>

            <g id="${uid}-layer-0">
              <g class="dcf-ground">
                <path class="dcf-draw" pathLength="1" d="${groundD}" style="--d:${tl.ground}ms" />
                <path class="dcf-tufts dcf-fade" d="${tufts}" style="--d:${tl.ground + 500}ms" />
                ${pebblesHtml}
              </g>
              ${placed.filter((p) => p.seat === 'behind').map((p) => renderCrewHtml(p, 'body')).join('')}
            </g>

            ${lettersHtml}

            <g id="${uid}-layer-1">
              ${placed.filter((p) => p.seat === 'behind').map((p) => renderCrewHtml(p, 'front')).join('')}
              ${placed.filter((p) => p.seat !== 'behind').map((p) => renderCrewHtml(p, 'body')).join('')}
            </g>

            ${hitRectsHtml}
          </svg>

          <div class="dcf-bubbles" id="${uid}-bubbles" aria-live="polite"></div>
        </div>

        <div class="dcf-doodles" id="${uid}-doodles" aria-hidden="true">
          ${doodlesHtml}
        </div>

        <div class="dcf-cta">
          <p class="dcf-tagline">${wordsHtml}</p>
          <div class="dcf-actions">
            <button type="button" class="dcf-btn dcf-pop is-outline" id="${uid}-btn-apk" style="--d:${tl.action(0)}ms">
              <svg class="dcf-icon" viewBox="-16 -16 32 32" width="18" height="18" aria-hidden="true">${doodleSvgInner('bolt')}</svg>
              <span>Download Android APK (v2.1)</span>
            </button>
            <a class="dcf-btn dcf-pop is-solid" href="/app/" style="--d:${tl.action(1)}ms">
              <svg class="dcf-icon" viewBox="-16 -16 32 32" width="18" height="18" aria-hidden="true">${doodleSvgInner('sparkle')}</svg>
              <span>Launch Live Web App →</span>
            </a>
          </div>
        </div>
      </div>

      <div class="dcf-bar dcf-rise" style="--d:120ms">
        <p class="dcf-copy">© 2026–2027 GuruStudy by HarshGuruJi • Strict Mission: 20 Nov 2026 – 15 Feb 2027 (88 Days).</p>
        <ul class="dcf-inline">
          ${GURU_LEGAL.map((lk) => `<li>${renderLinkHtml(lk)}</li>`).join('')}
        </ul>
        <ul class="dcf-inline dcf-socials">
          ${GURU_SOCIALS.map((lk) => `<li>${renderLinkHtml(lk)}</li>`).join('')}
        </ul>
        <button type="button" class="dcf-totop" id="${uid}-totop">
          <span>Back to top</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 20 C11 14 12.5 9 12 4 M6 10 C8 8 10 6 12 4 C14 6 16 8 18.5 9.5" />
          </svg>
        </button>
      </div>
    `;

    /* =========================================================================
       5. INTERACTIVITY, PHYSICS, EYES, BLINKING, LINE BOIL & STORYBOARD
       ========================================================================= */
    const svgEl = document.getElementById(`${uid}-svg`);
    const worldEl = document.getElementById(`${uid}-world`);
    const bubblesEl = document.getElementById(`${uid}-bubbles`);
    const layer0 = document.getElementById(`${uid}-layer-0`);
    const layer1 = document.getElementById(`${uid}-layer-1`);
    const doodleEls = Array.from(target.querySelectorAll('.dcf-doodle'));
    const crewLayers = [layer0, layer1];

    // Cache eye DOM refs
    const eyeMap = placed.map((p) =>
      p.art.eyes.map((_, e) => ({
        blink: target.querySelector(`[data-crew-blink="${p.i}-${e}"]`),
        pupil: target.querySelector(`[data-crew-pupil="${p.i}-${e}"]`),
      }))
    );

    const sim = {
      floaters: [],
      w: 0,
      h: 0,
      px: NaN,
      py: NaN,
      inside: false,
      visible: false,
      play: false,
      start: 0,
      gaze: [],
      seed: 1,
      reduced: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };

    function paintDoodles() {
      const k = clamp(sim.w / 1100, 0.5, 1);
      for (let i = 0; i < sim.floaters.length; i++) {
        const el = doodleEls[i];
        const f = sim.floaters[i];
        if (!el || !f) continue;
        let sc = k;
        let op = 1;
        if (f.pop > 0) {
          const age = 1.4 - f.pop;
          sc = k * (1 + Math.min(1, age / 0.3) * 0.7);
          op = Math.max(0, 1 - age / 0.3);
        }
        el.style.transform = `translate3d(${f.x.toFixed(1)}px,${f.y.toFixed(1)}px,0) rotate(${f.rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        el.style.opacity = String(op);
      }
    }

    function resizeWorld() {
      if (!worldEl) return;
      const rect = worldEl.getBoundingClientRect();
      const ow = sim.w;
      const oh = sim.h;
      sim.w = rect.width;
      sim.h = rect.height;
      if (sim.floaters.length !== doodleList.length || !ow) {
        sim.floaters = doodleList.map((_, k) => ({
          x: (0.04 + 0.92 * ((k + hash(k * 9.1) * 0.8) / Math.max(1, doodleList.length))) * rect.width,
          y: (0.02 + hash(k * 3.3) * 0.56) * rect.height,
          vx: 0,
          vy: 0,
          rot: (hash(k * 1.7) - 0.5) * 50,
          vr: (hash(k * 6.1) - 0.5) * 30,
          fall: 9 + hash(k * 2.9) * 16,
          phase: hash(k * 8.3) * Math.PI * 2,
          pop: 0,
        }));
      } else if (ow && oh) {
        for (const f of sim.floaters) {
          f.x *= rect.width / ow;
          f.y *= rect.height / oh;
        }
      }
      paintDoodles();
    }

    resizeWorld();
    if (typeof ResizeObserver !== 'undefined' && worldEl) {
      const ro = new ResizeObserver(resizeWorld);
      ro.observe(worldEl);
    }

    // Pointer tracking
    target.addEventListener('pointermove', (e) => {
      sim.px = e.clientX;
      sim.py = e.clientY;
      sim.inside = true;
    });
    target.addEventListener('pointerdown', (e) => {
      sim.px = e.clientX;
      sim.py = e.clientY;
      sim.inside = true;
    });
    target.addEventListener('pointerleave', () => {
      sim.inside = false;
    });

    // Click to hop & speak
    let talkTimeout = 0;
    function pokeCrew(idx) {
      const p = placed[idx];
      if (!p) return;

      // Trigger hop animation
      const hopEl = target.querySelector(`[data-crew-hop="${p.i}"]`);
      if (hopEl) {
        hopEl.classList.remove('is-hop');
        void hopEl.getBoundingClientRect();
        hopEl.classList.add('is-hop');
      }

      // Show speech bubble
      if (bubblesEl && p.m.says) {
        const leftPct = (((p.x - view.x) / view.w) * 100).toFixed(3) + '%';
        const topPct = (((p.y + p.art.box.t * p.scale - 6 - view.y) / view.h) * 100).toFixed(3) + '%';
        const isLeft = p.x > view.x + view.w * 0.72 ? ' is-left' : '';
        bubblesEl.innerHTML = `<div class="dcf-bubble${isLeft}" style="left:${leftPct}; top:${topPct}">${p.m.says}</div>`;
      }

      window.clearTimeout(talkTimeout);
      talkTimeout = window.setTimeout(() => {
        if (bubblesEl) bubblesEl.innerHTML = '';
        if (hopEl) hopEl.classList.remove('is-hop');
      }, 2800);
    }

    target.querySelectorAll('[data-crew-hit]').forEach((rect) => {
      const idx = parseInt(rect.getAttribute('data-crew-hit'), 10);
      rect.addEventListener('click', () => pokeCrew(idx));
      rect.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pokeCrew(idx);
        }
      });
    });

    // Pop doodle on tap/click
    doodleEls.forEach((el, k) => {
      el.addEventListener('pointerdown', () => {
        const f = sim.floaters[k];
        if (f && f.pop <= 0) {
          f.pop = 1.4;
          paintDoodles();
        }
      });
    });

    // Wire APK button to landing page modal if present
    const footerApkBtn = document.getElementById(`${uid}-btn-apk`);
    if (footerApkBtn) {
      footerApkBtn.addEventListener('click', () => {
        const modal = document.getElementById('apk-download-modal');
        if (modal) {
          modal.classList.add('active');
        } else {
          window.location.href = '/downloads/GuruStudy-v1.0.apk';
        }
      });
    }

    // Back to top smooth scroll
    const toTopBtn = document.getElementById(`${uid}-totop`);
    if (toTopBtn) {
      toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: sim.reduced ? 'auto' : 'smooth' });
      });
    }

    // Storyboard trigger via IntersectionObserver
    function triggerPlay() {
      if (!sim.play) {
        sim.play = true;
        sim.start = performance.now();
        target.setAttribute('data-play', '1');
      }
    }

    if (sim.reduced || typeof IntersectionObserver === 'undefined') {
      sim.visible = true;
      triggerPlay();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            sim.visible = e.isIntersecting;
            if (e.isIntersecting && e.intersectionRatio > 0.08) {
              triggerPlay();
            }
          }
        },
        { threshold: [0, 0.08, 0.25] }
      );
      io.observe(target);
    }

    // Main Living Animation Loop
    let last = performance.now();
    let boilAt = 0;
    let boil = 0;

    function rand() {
      sim.seed = (sim.seed * 16807) % 2147483647;
      return sim.seed / 2147483647;
    }

    function svgPoint(svg, cx, cy) {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const inv = m.inverse();
      return { x: inv.a * cx + inv.c * cy + inv.e, y: inv.b * cx + inv.d * cy + inv.f };
    }

    function tick(now) {
      requestAnimationFrame(tick);
      if (!sim.visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // 1. Eyes & Blinks
      let ptrSvg = null;
      if (svgEl && sim.inside) {
        ptrSvg = svgPoint(svgEl, sim.px, sim.py);
      }

      for (let c = 0; c < placed.length; c++) {
        const p = placed[c];
        if (!sim.gaze[c]) {
          sim.gaze[c] = { x: 0, y: 0, tx: 0, ty: 0, next: 0, blinkAt: t + 1 + hash(c * 3.7) * 3, blink: 0, offsets: {} };
        }
        const g = sim.gaze[c];

        if (!ptrSvg && t > g.next) {
          const other = placed[(c + 1 + Math.floor(rand() * Math.max(1, placed.length - 1))) % placed.length];
          if (other && rand() < 0.45) {
            g.tx = other.x;
            g.ty = other.y - 60 * other.scale;
          } else {
            g.tx = p.x + (rand() - 0.5) * 900;
            g.ty = p.y - 80 * p.scale + (rand() - 0.5) * 500;
          }
          g.next = t + 1.4 + rand() * 2.6;
        }

        if (t > g.blinkAt) {
          g.blink = 0.16;
          g.blinkAt = t + 2.2 + rand() * 4;
        }
        g.blink = Math.max(0, g.blink - dt);
        const lid = g.blink > 0 ? 0.12 + (Math.abs(g.blink - 0.08) / 0.08) * 0.88 : 1;
        const eyes = eyeMap[c] || [];

        for (let e = 0; e < p.art.eyes.length; e++) {
          const eye = p.art.eyes[e];
          const ex = p.x + eye.x * p.scale * p.flip;
          const ey = p.y + eye.y * p.scale;
          const tx = ptrSvg ? ptrSvg.x : g.tx;
          const ty = ptrSvg ? ptrSvg.y : g.ty;
          const o = lookAt(ex, ey, tx, ty, eye.max, 220);
          const ref = eyes[e];
          if (!ref) continue;
          const prev = g.offsets[e] || { x: 0, y: 0 };
          const ease = Math.min(1, dt * (ptrSvg ? 14 : 6));
          const nx = prev.x + (o.x * p.flip - prev.x) * ease;
          const ny = prev.y + (o.y - prev.y) * ease;
          g.offsets[e] = { x: nx, y: ny };
          if (ref.pupil) ref.pupil.setAttribute('transform', `translate(${nx.toFixed(2)} ${ny.toFixed(2)})`);
          if (ref.blink) ref.blink.setAttribute('transform', `translate(0 ${(eye.y * (1 - lid)).toFixed(2)}) scale(1 ${lid.toFixed(3)})`);
        }
      }

      // 2. Drifting Interactive Doodles
      if (worldEl && sim.floaters.length) {
        const started = sim.play && sim.start ? now - sim.start > tl.doodles || sim.reduced : false;
        if (started) {
          const r = worldEl.getBoundingClientRect();
          const px = sim.inside ? sim.px - r.left : NaN;
          const py = sim.inside ? sim.py - r.top : NaN;
          if (!sim.reduced) {
            for (const f of sim.floaters) {
              stepFloater(f, dt, t, sim.w, sim.h, px, py, 110, rand);
            }
          }
          paintDoodles();
        }
      }

      // 3. Hand-drawn 8fps Line Boil
      if (!sim.reduced && now - boilAt > 125) {
        boilAt = now;
        boil = (boil + 1) % 3;
        const filt = `url(#${uid}-boil${boil})`;
        for (const layer of crewLayers) {
          if (layer) layer.setAttribute('filter', filt);
        }
      }
    }

    requestAnimationFrame(tick);
  }

  // Auto-mount if container exists on DOMContentLoaded
  if (typeof document !== 'undefined') {
    const autoMount = () => {
      if (document.getElementById('gurustudy-doodle-footer')) {
        mountGuruDoodleFooter('gurustudy-doodle-footer');
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoMount);
    } else {
      autoMount();
    }
  }

  if (typeof window !== 'undefined') {
    window.mountGuruDoodleFooter = mountGuruDoodleFooter;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hash, clamp, layoutWord, seatPoint, lookAt, stepFloater, timeline, mountGuruDoodleFooter };
  }
})();
