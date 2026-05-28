import { useEffect, useMemo, useState } from "react";
import type { Song } from "../types/music";

type UseSongCatalogParams = {
  songs: Song[];
  accessCounts: Record<string, number>;
  initialQuery: string;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function useSongCatalog({
  songs,
  accessCounts,
  initialQuery,
}: UseSongCatalogParams) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const categories = useMemo(
    () => [...new Set(songs.map((song) => song.category))].sort(),
    [songs],
  );

  const artists = useMemo(
    () => [...new Set(songs.map((song) => song.artist))].sort(),
    [songs],
  );

  const filteredSongs = useMemo(() => {
    const search = normalize(query.trim());

    return [...songs]
      .filter((song) => {
        const searchable = normalize(
          `${song.title} ${song.artist} ${song.category}`,
        );
        return (
          (!search || searchable.includes(search)) &&
          (!category || song.category === category) &&
          (!artist || song.artist === artist)
        );
      })
      .sort(
        (left, right) =>
          (accessCounts[right.id] ?? 0) - (accessCounts[left.id] ?? 0),
      );
  }, [accessCounts, artist, category, query, songs]);

  return {
    filteredSongs,
    categories,
    artists,
    query,
    category,
    artist,
    setQuery,
    setCategory,
    setArtist,
  };
}
