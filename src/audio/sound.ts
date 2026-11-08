/**
 * Tiny Web Audio synthesizer for playful game sounds — no audio files needed.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuf: AudioBuffer | null = null;
  enabled = true;

  private audio(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private noise(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuf) {
      const len = Math.floor(ctx.sampleRate * 0.5);
      this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    return this.noiseBuf;
  }

  private tone(
    freq: number,
    {
      at = 0,
      dur = 0.15,
      type = 'sine' as OscillatorType,
      vol = 0.3,
      slideTo,
    }: { at?: number; dur?: number; type?: OscillatorType; vol?: number; slideTo?: number } = {},
  ) {
    const ctx = this.audio();
    if (!ctx || !this.master) return;
    const t = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private burst(freq: number, { at = 0, dur = 0.05, vol = 0.25, q = 4 } = {}) {
    const ctx = this.audio();
    if (!ctx || !this.master) return;
    const t = ctx.currentTime + at;
    const src = ctx.createBufferSource();
    src.buffer = this.noise(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t, Math.random() * 0.3);
    src.stop(t + dur + 0.02);
  }

  /** Light clack of a chip landing on the mat. */
  chip() {
    this.burst(3200, { dur: 0.04, vol: 0.35, q: 6 });
    this.tone(1900, { dur: 0.06, type: 'triangle', vol: 0.12, at: 0.005 });
    this.tone(2600, { dur: 0.05, type: 'sine', vol: 0.07, at: 0.03 });
  }

  click() {
    this.tone(880, { dur: 0.05, type: 'triangle', vol: 0.08 });
  }

  select() {
    this.tone(1200, { dur: 0.07, type: 'sine', vol: 0.1, slideTo: 1600 });
  }

  error() {
    this.tone(260, { dur: 0.12, type: 'square', vol: 0.05 });
    this.tone(200, { dur: 0.16, type: 'square', vol: 0.05, at: 0.1 });
  }

  /** Dice rattling inside the tray. Returns a stop function. */
  shake(durationMs: number): () => void {
    if (!this.audio()) return () => {};
    let stopped = false;
    const end = performance.now() + durationMs;
    const tick = () => {
      if (stopped || performance.now() > end) return;
      this.burst(1800 + Math.random() * 2600, { dur: 0.035, vol: 0.18 + Math.random() * 0.15, q: 8 });
      if (Math.random() < 0.35) this.burst(900 + Math.random() * 400, { dur: 0.05, vol: 0.12, q: 3 });
      window.setTimeout(tick, 45 + Math.random() * 45);
    };
    tick();
    return () => {
      stopped = true;
    };
  }

  /** A die landing on the tray. */
  land(index = 0) {
    this.tone(150 - index * 10, { dur: 0.18, type: 'sine', vol: 0.4, slideTo: 70 });
    this.burst(2400, { dur: 0.05, vol: 0.3, q: 5 });
    this.burst(3000, { dur: 0.03, vol: 0.15, q: 5, at: 0.07 });
  }

  win(big = false) {
    const notes = big ? [523, 659, 784, 1047, 1319] : [659, 784, 1047];
    notes.forEach((f, i) => {
      this.tone(f, { at: i * 0.085, dur: 0.22, type: 'triangle', vol: 0.18 });
      this.tone(f * 2, { at: i * 0.085, dur: 0.12, type: 'sine', vol: 0.05 });
    });
    // coin sparkles
    for (let i = 0; i < (big ? 6 : 3); i++) this.tone(2000 + Math.random() * 1500, { at: 0.25 + i * 0.07, dur: 0.08, vol: 0.06 });
  }

  lose() {
    this.tone(392, { dur: 0.18, type: 'triangle', vol: 0.15 });
    this.tone(330, { at: 0.16, dur: 0.18, type: 'triangle', vol: 0.13 });
    this.tone(262, { at: 0.32, dur: 0.32, type: 'triangle', vol: 0.12, slideTo: 240 });
  }

  jackpot() {
    const melody = [523, 659, 784, 1047, 784, 1047, 1319, 1568];
    melody.forEach((f, i) => {
      this.tone(f, { at: i * 0.1, dur: 0.25, type: 'square', vol: 0.06 });
      this.tone(f, { at: i * 0.1, dur: 0.3, type: 'triangle', vol: 0.16 });
    });
    this.tone(2093, { at: 0.85, dur: 0.8, type: 'sine', vol: 0.12 });
    for (let i = 0; i < 12; i++) this.tone(1800 + Math.random() * 2400, { at: 0.8 + i * 0.06, dur: 0.07, vol: 0.05 });
  }
}

export const sound = new SoundEngine();
