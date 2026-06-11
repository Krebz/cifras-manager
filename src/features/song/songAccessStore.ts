import { useCallback, useEffect, useState } from "react";
import { getSongAccessCounts } from "../../services/songRepository";

type AccessCounts = Record<string, number>;
type Listener = (counts: AccessCounts) => void;

const STORAGE_KEY = "cifras_access_counts";

function loadFromStorage(): AccessCounts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AccessCounts) : {};
  } catch {
    return {};
  }
}

function persistToStorage(counts: AccessCounts): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Ignore storage errors (e.g. private mode quota)
  }
}

const staticCounts = getSongAccessCounts();
const persisted = loadFromStorage();

let accessCounts: AccessCounts = { ...staticCounts, ...persisted };

const listeners = new Set<Listener>();

const notify = () => {
  for (const listener of listeners) {
    listener(accessCounts);
  }
};

export function registerSongAccess(songId: string) {
  accessCounts = {
    ...accessCounts,
    [songId]: (accessCounts[songId] ?? 0) + 1,
  };
  persistToStorage(accessCounts);
  notify();
}

export function useSongAccessCounts() {
  const [counts, setCounts] = useState<AccessCounts>(accessCounts);

  useEffect(() => {
    const handleUpdate: Listener = (nextCounts) => setCounts(nextCounts);
    listeners.add(handleUpdate);
    setCounts(accessCounts);

    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const registerAccess = useCallback((songId: string) => {
    registerSongAccess(songId);
  }, []);

  return {
    accessCounts: counts,
    registerAccess,
  };
}
