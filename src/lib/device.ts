// Stable per-browser device identity.
//
// The backend (BlockBlockedDevices middleware) identifies every client by an
// `X-Device-Id` header — logged in or not — and uses it for device blocking and
// audit logs. We mint the id on the first visit, keep it in localStorage, and send
// it on every API request. It is never cleared on logout. Format must match the
// backend: /^[A-Za-z0-9._-]{8,100}$/.

const DEVICE_ID_KEY = 'device_id';
const VALID = /^[A-Za-z0-9._-]{8,100}$/;

function mint(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

let memoryId: string | null = null;

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const stored = localStorage.getItem(DEVICE_ID_KEY);
    if (stored && VALID.test(stored)) return stored;
    // Missing or from an older, incompatible format (e.g. contained ':'): replace it.
    const id = mint();
    localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
  } catch {
    // Storage blocked: keep one id for the lifetime of the page.
    return (memoryId ??= mint());
  }
}

/** Descriptive details stored with the push registration. */
export function getDeviceMeta() {
  return {
    user_agent: navigator.userAgent,
    platform: navigator.platform,
  };
}
