import type { Song } from "../types/music";
import { songs } from "../data/songs";

export function getAllSongs(): Song[] {
  return songs;
}

export function getSongById(id: string): Song | undefined {
  return songs.find((song) => song.id === id);
}

export function getSongAccessCounts(): Record<string, number> {
  return Object.fromEntries(songs.map((song) => [song.id, song.accessCount]));
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
