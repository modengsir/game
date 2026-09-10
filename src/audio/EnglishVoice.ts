export class EnglishVoice {
  private enabled = true;
  private spokenThisWave = new Set<string>();

  get isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) window.speechSynthesis?.cancel();
    return this.enabled;
  }

  resetWave() {
    this.spokenThisWave.clear();
  }

  speakWord(word: string, force = false) {
    if (!this.enabled || !('speechSynthesis' in window)) return;
    if (!force && this.spokenThisWave.has(word)) return;
    this.spokenThisWave.add(word);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.78;
    utterance.pitch = 1.12;
    utterance.volume = 0.85;
    window.speechSynthesis.speak(utterance);
  }
}
