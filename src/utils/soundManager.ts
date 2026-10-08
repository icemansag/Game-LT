// src/utils/soundManager.ts
// Gestor de efectos de sonido usando Web Audio API nativa
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    // Inicializar el contexto de audio de forma segura al primer toque del usuario
    const initAudio = () => {
      this.ensureContext();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('click', initAudio);
      window.addEventListener('keydown', initAudio);
      window.addEventListener('touchstart', initAudio);
    }
  }

  public ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopTensionMusic();
    } else if (this.isMusicPlaying) {
      // Si se vuelve a activar y estaba sonando la música, la reiniciamos
      this.startTensionMusic();
    }
    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stopTensionMusic();
    }
  }

  // 1. Sonido de Disparo Láser (Agente)
  public playLaserShot() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Frecuencia descendente rápida para simular láser espacial
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.error("Error reproduciendo láser", e);
    }
  }

  // 2. Sonido de Acierto / Eliminación de Alien
  public playHitAlien() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Frecuencia ascendente de éxito
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      osc.frequency.linearRampToValueAtTime(900, now + 0.2);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.error("Error reproduciendo acierto", e);
    }
  }

  // 3. Sonido de Error / Disparo a Civil o Fallo
  public playError() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      // Sonido grave y tosco de penalización
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(100, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.error("Error reproduciendo error", e);
    }
  }

  // 4. Sonido de Clic en Botones de Interfaz
  public playClick() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.error("Error reproduciendo clic", e);
    }
  }

  // --- HILO MUSICAL DE TENSIÓN ---
  public startTensionMusic() {
    this.isMusicPlaying = true;
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [110, 103.83, 98, 92.5];
    let step = 0;

    if (this.musicInterval) clearInterval(this.musicInterval);

    const playDroneBeat = () => {
      if (!this.enabled || !this.isMusicPlaying) return;
      this.ensureContext();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.5);

        step++;
      } catch (e) {
        console.error("Error en hilo musical", e);
      }
    };

    playDroneBeat();
    this.musicInterval = setInterval(playDroneBeat, 3500);
  }

  public stopTensionMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sounds = new SoundManager();
