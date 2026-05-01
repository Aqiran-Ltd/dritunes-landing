export function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Ascending three-note chime: G4 → B4 → D5
    const notes = [392, 493.88, 587.33];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Slight detuning on each note for a warmer tone
      const detune = ctx.createOscillator();
      const detuneGain = ctx.createGain();
      detune.frequency.value = freq * 1.004;
      detuneGain.gain.value = 0.08;
      detune.connect(detuneGain);
      detuneGain.connect(gain);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.value = freq;

      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.start(t);
      detune.start(t);
      osc.stop(t + 0.55);
      detune.stop(t + 0.55);
    });
  } catch {
    // AudioContext not supported or blocked
  }
}
