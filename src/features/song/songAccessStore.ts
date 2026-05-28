import { useCallback, useEffect, useState } from "react";
import { getSongAccessCounts } from "../../services/songRepository";

type AccessCounts = Record<string, number>;

type Listener = (counts: AccessCounts) => void;

let accessCounts: AccessCounts = getSongAccessCounts();
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
