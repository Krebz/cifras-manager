import { useEffect, useMemo, useState } from "react";
import { getNavigationKind } from "../app/router";
import {
  fetchSongs,
  getAllSongs,
  getCatalogSongs,
  getSongArtists,
  getSongCategories,
  getSongLiturgies,
} from "../services/songRepository";
import { loadViewState, saveViewState } from "../services/viewStateStore";

export type SortOrder = "acessos" | "az" | "za";

export const CATALOG_FILTERS_KEY = "catalog-filters";

type CatalogFilters = {
  query: string;
  category: string;
  artist: string;
  liturgy: string;
  sort: SortOrder;
};

const emptyFilters: CatalogFilters = {
  query: "",
  category: "",
  artist: "",
  liturgy: "",
  sort: "acessos",
};

/**
 * No "voltar" o catálogo reabre como estava; numa entrada nova (menu, home)
 * começa limpo. A busca da URL (`?q=`), quando existe, sempre manda.
 */
function initialFilters(initialQuery: string): CatalogFilters {
  const saved =
    getNavigationKind() === "pop"
      ? { ...emptyFilters, ...loadViewState(CATALOG_FILTERS_KEY, emptyFilters) }
      : emptyFilters;
  return { ...saved, query: initialQuery || saved.query };
}

type UseSongCatalogParams = {
  accessCounts: Record<string, number>;
  initialQuery: string;
};

export function useSongCatalog({
  accessCounts,
  initialQuery,
}: UseSongCatalogParams) {
  const [songs, setSongs] = useState(() => getAllSongs());
  const [restored] = useState(() => initialFilters(initialQuery));
  const [query, setQuery] = useState(restored.query);
  const [category, setCategory] = useState(restored.category);
  const [artist, setArtist] = useState(restored.artist);
  const [liturgy, setLiturgy] = useState(restored.liturgy);
  const [sort, setSort] = useState<SortOrder>(restored.sort);

  useEffect(() => {
    fetchSongs()
      .then(setSongs)
      .catch(() => {}); // fallback: mantém dados do localStorage
  }, []);

  // Só sobrescreve com a busca da URL quando ela existe — um `?q=` vazio não
  // pode apagar o filtro restaurado.
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    saveViewState(CATALOG_FILTERS_KEY, { query, category, artist, liturgy, sort });
  }, [query, category, artist, liturgy, sort]);

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
