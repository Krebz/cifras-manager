import { useEffect, useMemo, useState } from "react";
import {
  getAllSongs,
  getCatalogSongs,
  getSongArtists,
  getSongCategories,
  getSongLiturgies,
} from "../services/songRepository";

export type SortOrder = "acessos" | "az" | "za";

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
  const [sort, setSort] = useState<SortOrder>("acessos");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const categories = useMemo(() => getSongCategories(songs), [songs]);
  const liturgies = useMemo(() => getSongLiturgies(songs), [songs]);
  const artists = useMemo(() => getSongArtists(songs), [songs]);

  const filteredSongs = useMemo(() => {
    const base = getCatalogSongs(songs, accessCounts, query, category, artist, liturgy);
    if (sort === "az") return [...base].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    if (sort === "za") return [...base].sort((a, b) => b.title.localeCompare(a.title, "pt-BR"));
    return base;
  }, [accessCounts, artist, category, liturgy, query, sort, songs]);

  return {
    filteredSongs,
    categories,
    liturgies,
    artists,
    query,
    category,
    liturgy,
    artist,
    sort,
    setQuery,
    setCategory,
    setLiturgy,
    setArtist,
    setSort,
  };
}
