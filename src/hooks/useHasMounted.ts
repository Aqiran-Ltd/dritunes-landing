import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// True only on the client, after hydration — false on the server and during the
// initial client render, so consumers can defer client-only UI (e.g. theme-dependent
// rendering) without a hydration mismatch. Replaces the `useState(false)` +
// `useEffect(() => setMounted(true), [])` pattern.
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
