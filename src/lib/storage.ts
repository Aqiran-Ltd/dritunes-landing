export function getStorageBaseUrl(): string {
  if (typeof window === 'undefined') return 'http://localhost:8000/storage';
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/storage';
  }
  return 'https://admin.dritunesconsult.com/storage';
}

// The backend's `asset()` helper builds storage URLs from the incoming request's
// Host header, which (via the Next.js proxy) can end up pointing back at this
// frontend's own origin instead of the backend. Always re-derive the storage
// path and rebuild it against the known-correct backend host, whether the
// input is a bare relative path or an absolute URL (correct or not).
export function resolveStorageUrl(url?: string | null): string {
  if (!url) return '';
  const marker = '/storage/';
  const markerIndex = url.indexOf(marker);
  const relativePath = markerIndex >= 0 ? url.slice(markerIndex + marker.length) : url.replace(/^\/+/, '');
  return `${getStorageBaseUrl()}/${relativePath}`;
}
