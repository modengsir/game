/**
 * 轻量音效：用 WebAudio 实时合成，无需任何音频素材。
 * 首次用户交互后解锁 AudioContext。
 */
export class AudioManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  unlock() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.28;
    this.master.connect(this.ctx.destination);
  }

  private beep(freq: number, dur: number, type: OscillatorType = 'sine', vol = 1) {
    if (!this.ctx || !this.master || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  play(name: string) {
    switch (name) {
      case 'shoot': this.beep(520, 0.06, 'triangle', 0.5); break;
      case 'hit': this.beep(240, 0.05, 'square', 0.35); break;
      case 'build': this.beep(660, 0.12, 'sine', 0.8); this.beep(880, 0.12, 'sine', 0.5); break;
      case 'upgrade': this.beep(700, 0.1, 'sine'); setTimeout(() => this.beep(950, 0.14, 'sine'), 80); break;
      case 'sell': this.beep(400, 0.12, 'sawtooth', 0.5); break;
      case 'kill': this.beep(880, 0.07, 'triangle', 0.6); break;
      case 'leak': this.beep(160, 0.25, 'sawtooth', 0.7); break;
      case 'wave': this.beep(523, 0.12, 'sine'); setTimeout(() => this.beep(784, 0.18, 'sine'), 110); break;
      case 'win': [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.beep(f, 0.22, 'sine'), i * 130)); break;
      case 'lose': [400, 330, 262].forEach((f, i) => setTimeout(() => this.beep(f, 0.3, 'sawtooth', 0.6), i * 160)); break;
      case 'error': this.beep(180, 0.12, 'square', 0.4); break;
    }
  }
}
