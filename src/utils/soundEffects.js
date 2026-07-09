// Synthesize 8-bit retro sounds programmatically using Web Audio API (Zero static audio files)
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  // 1. playSuccess: 8-bit rising arcade melody (e.g. Konami Code Success)
  playSuccess() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square'; // Classic square sound
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0.08, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.15);
    });
  }

  // 2. playPurr: Low frequency kitten purring (Neko Petting click)
  playPurr() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; // Smooth triangle wave
    osc.frequency.setValueAtTime(80, now);
    
    // Modulate frequency to create the vibration/purr rhythm
    osc.frequency.linearRampToValueAtTime(95, now + 0.15);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);
    osc.frequency.linearRampToValueAtTime(95, now + 0.45);
    osc.frequency.linearRampToValueAtTime(80, now + 0.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.61);
  }

  // 3. playGlitch: Synthesized white noise sweeps and pitch drops (Self-Destruct Sequence)
  playGlitch() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Play multiple erratic pitch drops and noise sweeps
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = Math.random() > 0.5 ? 'sawtooth' : 'square';
      osc.frequency.setValueAtTime(600 - i * 80, now + i * 0.3);
      osc.frequency.exponentialRampToValueAtTime(40, now + i * 0.3 + 0.28);
      
      gain.gain.setValueAtTime(0.05, now + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.28);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + i * 0.3);
      osc.stop(now + i * 0.3 + 0.3);
    }
  }

  // 4. playLaser: High pitched chirps (Laser chase clicks)
  playLaser() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const sounds = new SoundEffects();
