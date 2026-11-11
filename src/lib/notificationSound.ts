/**
 * Browsers only let a page make sound after the user has interacted with it, and a context created
 * outside a click/keypress starts "suspended" (silent). Our chime fires from a push message or a
 * poll, never from a click, so we keep ONE shared context, unlock it on the first interaction,
 * and resume it before every play.
 */
let ctx: AudioContext | null = null;
let unlockInstalled = false;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx && ctx.state !== 'closed') return ctx;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  ctx = new AudioCtx();
  return ctx;
}

const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchend'] as const;

/** Call once on the client: the first tap/click/keypress un-suspends audio for the rest of the session. */
export function installAudioUnlock() {
  if (typeof window === 'undefined' || unlockInstalled) return;
  unlockInstalled = true;

  const unlock = () => {
    const c = getContext();
    if (!c) return;
    c.resume()
      .then(() => {
        if (c.state === 'running') UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, unlock));
      })
      .catch(() => {});
  };
  UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
}

export function playNotificationSound() {
  const ctx = getContext();
  if (!ctx) return;
  installAudioUnlock();
  // Still suspended means the user hasn't interacted yet: stay silent rather than queue a stale chime.
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => ctx.state === 'running' && chime(ctx)).catch(() => {});
    return;
  }
  chime(ctx);
}

function chime(ctx: AudioContext) {
  try {

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
