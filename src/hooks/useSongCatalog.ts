import { useEffect, useMemo, useState } from "react";
import {
  getAllSongs,
  getCatalogSongs,
  getSongArtists,
  getSongCategories,
} from "../services/songRepository";

type UseSongCatalogParams = {
  accessCounts: Record<string, number>;
  initialQuery: string;
};

export function useSongCatalog({
  accessCounts,
  initialQuery,
}: UseSongCatalogParams) {
  const songs = getAllSongs();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const categories = useMemo(() => getSongCategories(songs), [songs]);

  const artists = useMemo(() => getSongArtists(songs), [songs]);

  const filteredSongs = useMemo(
    () => getCatalogSongs(songs, accessCounts, query, category, artist),
    [accessCounts, artist, category, query, songs],
  );

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
