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

const removeDiacritics = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function searchSongs(query: string): Song[] {
  const normalizedQuery = removeDiacritics(query.trim().toLowerCase());

  if (!normalizedQuery) {
    return songs;
  }

  return songs.filter((song) => {
    const searchable = removeDiacritics(
      `${song.title} ${song.artist} ${song.category}`.toLowerCase(),
    );

    return searchable.includes(normalizedQuery);
  });
}
