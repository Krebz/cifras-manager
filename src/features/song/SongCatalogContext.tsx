import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Song } from "../../types/music";
import {
  getAllSongs,
  getSongAccessCounts,
} from "../../services/songRepository";

type SongCatalogContextValue = {
  songs: Song[];
  accessCounts: Record<string, number>;
  registerAccess: (songId: string) => void;
};

const SongCatalogContext = createContext<SongCatalogContextValue | undefined>(
  undefined,
);

export function SongCatalogProvider({ children }: { children: ReactNode }) {
  const songs = getAllSongs();
  const [accessCounts, setAccessCounts] = useState<Record<string, number>>(
    getSongAccessCounts(),
  );
  const registerAccess = useCallback((songId: string) => {
    setAccessCounts((current) => ({
      ...current,
      [songId]: (current[songId] ?? 0) + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({
      songs,
      accessCounts,
      registerAccess,
    }),
    [accessCounts, registerAccess],
  );

  return (
    <SongCatalogContext.Provider value={value}>
      {children}
    </SongCatalogContext.Provider>
  );
}

export function useSongCatalog() {
  const context = useContext(SongCatalogContext);

  if (!context) {
    throw new Error("useSongCatalog must be used inside SongCatalogProvider");
  }

  return context;
}
