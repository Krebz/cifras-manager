import { useEffect, useMemo, useState } from "react";
import {
  getAllSongs,
  getCatalogSongs,
  getSongArtists,
  getSongCategories,
  getSongLiturgies,
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
  const [liturgy, setLiturgy] = useState("");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const categories = useMemo(() => getSongCategories(songs), [songs]);
  const liturgies = useMemo(() => getSongLiturgies(songs), [songs]);
  const artists = useMemo(() => getSongArtists(songs), [songs]);

  const filteredSongs = useMemo(
    () => getCatalogSongs(songs, accessCounts, query, category, artist, liturgy),
    [accessCounts, artist, category, liturgy, query, songs],
  );

  return {
    filteredSongs,
    categories,
    liturgies,
    artists,
    query,
    category,
    liturgy,
    artist,
    setQuery,
    setCategory,
    setLiturgy,
    setArtist,
  };
}
