/**
 * GuruStudy - Web Audio API Ambient Soundscapes & Zen Engine (Prompt 21)
 * 100% Offline, synthesized noise and binaural tone generator with micro-breaks.
 */

class WebAudioSoundscapes {
  constructor() {
    this.audioCtx = null;
    this.currentMode = 'silent';
    this.gainNode = null;
    this.activeNodes = [];
    this.volume = 0.5;
    this.isMuted = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stopCurrentSound() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Node already stopped
      }
    });
    this.activeNodes = [];
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.audioCtx && !this.isMuted) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }

  playMode(mode) {
    this.currentMode = mode;
    this.stopCurrentSound();

    if (mode === 'silent') return;

    this.initContext();

    switch (mode) {
      case 'rain':
        this.playPinkNoiseRain();
        break;
      case 'binaural_gamma':
        this.playGammaBinauralBeats();
        break;
      case 'library':
        this.playLibraryNoise();
        break;
      default:
        break;
    }
  }

  /**
   * Generates continuous Pink Noise passed through a Low-Pass filter to simulate soft rain
   */
  playPinkNoiseRain() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoiseSource = this.audioCtx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Filter to soft rain frequencies
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.audioCtx.currentTime);

    whiteNoiseSource.connect(filter);
    filter.connect(this.gainNode);
    whiteNoiseSource.start();

    this.activeNodes.push(whiteNoiseSource, filter);
  }

  /**
   * Generates 40Hz Gamma Binaural Beat (Left: 200Hz, Right: 240Hz) for deep focus
   */
  playGammaBinauralBeats() {
    const merger = this.audioCtx.createChannelMerger(2);

    // Left Ear: 200 Hz
    const oscLeft = this.audioCtx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(200, this.audioCtx.currentTime);

    // Right Ear: 240 Hz (240 - 200 = 40Hz Gamma Wave)
    const oscRight = this.audioCtx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(240, this.audioCtx.currentTime);

    const gainL = this.audioCtx.createGain();
    const gainR = this.audioCtx.createGain();
    gainL.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
    gainR.gain.setValueAtTime(0.06, this.audioCtx.currentTime);

    oscLeft.connect(gainL);
    oscRight.connect(gainR);

    gainL.connect(merger, 0, 0); // Left channel
    gainR.connect(merger, 0, 1); // Right channel

    merger.connect(this.gainNode);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push(oscLeft, oscRight, gainL, gainR, merger);
  }

  /**
   * Generates gentle library ambient white noise
   */
  playLibraryNoise() {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.035;
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();

    this.activeNodes.push(source, filter);
  }
}

// Global instance
const guruAudioSoundscapes = new WebAudioSoundscapes();
