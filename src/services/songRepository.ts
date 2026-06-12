import type { Song } from "../types/music";
import { songs as seedSongs } from "../data/songs";

const STORAGE_KEY = "cifras_songs";

function load(): Song[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Song[];
      const storedIds = new Set(stored.map((s) => s.id));
      const newFromSeed = seedSongs.filter((s) => !storedIds.has(s.id));
      if (newFromSeed.length > 0) {
        const merged = [...stored, ...newFromSeed];
        persist(merged);
        return merged;
      }
      return stored;
    }
  } catch {
    // ignore
  }
  persist(seedSongs);
  return seedSongs;
}

function persist(list: Song[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function getAllSongs(): Song[] {
  return load();
}

export function getSongById(id: string): Song | undefined {
  return load().find((song) => song.id === id);
}

export function getSongAccessCounts(): Record<string, number> {
  return Object.fromEntries(load().map((song) => [song.id, song.accessCount]));
}

export function createSong(data: Omit<Song, "id" | "accessCount">): Song {
  const list = load();
  const newSong: Song = { ...data, id: crypto.randomUUID(), accessCount: 0 };
  persist([...list, newSong]);
  return newSong;
}

export function updateSong(id: string, data: Partial<Omit<Song, "id">>): Song {
  const list = load();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error(`Song not found: ${id}`);
  const updated = { ...list[idx], ...data };
  const next = [...list];
  next[idx] = updated;
  persist(next);
  return updated;
}

export function deleteSong(id: string): void {
  persist(load().filter((s) => s.id !== id));
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Strip [ChordName] markers from song content, keeping only lyric text
const extractLyrics = (content: string) =>
  content.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();

export function getSongCategories(songsList: Song[]): string[] {
  return [...new Set(songsList.map((song) => song.category))].sort();
}

export function getSongArtists(songsList: Song[]): string[] {
  return [...new Set(songsList.map((song) => song.artist))].sort();
}

export function searchSongs(songsList: Song[], query: string): Song[] {
  const search = normalize(query.trim());

  if (!search) {
    return songsList;
  }

  return songsList.filter((song) => {
    const lyrics = extractLyrics(song.content);
    const searchable = normalize(
      `${song.title} ${song.artist} ${song.category} ${song.key} ${lyrics}`,
    );

    return searchable.includes(search);
  });
}

export function filterSongs(
  songsList: Song[],
  category: string,
  artist: string,
): Song[] {
  return songsList.filter(
    (song) =>
      (!category || song.category === category) &&
      (!artist || song.artist === artist),
  );
}

export function getCatalogSongs(
  songsList: Song[],
  accessCounts: Record<string, number>,
  query: string,
  category: string,
  artist: string,
): Song[] {
  const searchedSongs = searchSongs(songsList, query);
  const filteredSongs = filterSongs(searchedSongs, category, artist);

  return [...filteredSongs].sort(
    (left, right) =>
      (accessCounts[right.id] ?? 0) - (accessCounts[left.id] ?? 0),
  );
}

type RankingItem = {
  label: string;
  count: number;
};

export function getTopSongs(
  songsList: Song[],
  accessCounts: Record<string, number>,
  limit = 3,
): Song[] {
  return [...songsList]
    .sort(
      (left, right) =>
        (accessCounts[right.id] ?? 0) - (accessCounts[left.id] ?? 0),
    )
    .slice(0, limit);
}

export function getSongRankingByField(
  songsList: Song[],
  accessCounts: Record<string, number>,
  field: "category" | "artist",
  limit = 10,
): RankingItem[] {
  const totals = songsList.reduce<Record<string, number>>((result, song) => {
    result[song[field]] =
      (result[song[field]] ?? 0) + (accessCounts[song.id] ?? 0);
    return result;
  }, {});

  return Object.entries(totals)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
}
