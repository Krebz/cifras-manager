import { useEffect, useState } from "react";
import { navigate } from "../../app/router";
import { routes } from "../../app/routes";
import SongCard from "../../components/catalog/SongCard";
import { useSongCatalog } from "../../hooks/useSongCatalog";
import { portalStyles } from "../../styles/portalStyles";
import { useSongAccessCounts } from "./songAccessStore";

const HISTORY_KEY = "cifras_search_history";
const MAX_HISTORY = 5;

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]"); } catch { return []; }
}

function addToHistory(q: string) {
  const existing = getHistory().filter((x) => x.toLowerCase() !== q.toLowerCase());
  localStorage.setItem(HISTORY_KEY, JSON.stringify([q, ...existing].slice(0, MAX_HISTORY)));
}

type Props = {
  initialQuery: string;
  isDark: boolean;
};

export default function SongListPage({ initialQuery, isDark }: Props) {
  const { accessCounts } = useSongAccessCounts();
  const {
    filteredSongs,
    categories,
    artists,
    query,
    category,
    artist,
    setQuery,
    setCategory,
    setArtist,
  } = useSongCatalog({ accessCounts, initialQuery });
  const styles = portalStyles(isDark);
  const [history, setHistory] = useState<string[]>(getHistory);

  useEffect(() => {
    if (query.length < 2) return;
    const t = setTimeout(() => {
      addToHistory(query);
      setHistory(getHistory());
    }, 2000);
    return () => clearTimeout(t);
  }, [query]);

  const chipStyle: React.CSSProperties = {
    padding: "3px 11px",
    borderRadius: 999,
    border: isDark ? "1px solid rgba(148,163,184,0.25)" : "1px solid #e2e8f0",
    background: isDark ? "rgba(30,41,59,0.6)" : "#f1f5f9",
    color: isDark ? "#94a3b8" : "#475569",
    fontSize: 12,
    cursor: "pointer",
  };

  return (
    <main style={styles.surface}>
      <p style={styles.eyebrow}>Catálogo</p>
      <h1 style={{ ...styles.title, fontSize: "clamp(26px, 4vw, 36px)" }}>
        Lista de músicas
      </h1>
      <p style={styles.description}>
        Filtre o repertório e abra a cifra para ajustar tom, fonte e rolagem.
      </p>

      <div style={styles.filterBar}>
        <div style={{ flex: "1 1 280px", position: "relative", display: "flex", alignItems: "center" }}>
          <input
            aria-label="Pesquisar no catálogo"
            placeholder="Título, artista, categoria, tom ou letra..."
            value={query}
            style={{ ...styles.input, flex: "1 1 auto", paddingRight: query ? "40px" : undefined }}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: "18px",
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ×
            </button>
          )}
        </div>
        <select
          aria-label="Filtrar por categoria"
          value={category}
          style={styles.select}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por artista"
          value={artist}
          style={styles.select}
          onChange={(event) => setArtist(event.target.value)}
        >
          <option value="">Todos os artistas</option>
          {artists.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {!query && history.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>Recentes:</span>
          {history.map((h) => (
            <button key={h} type="button" style={chipStyle} onClick={() => setQuery(h)}>
              {h}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
            style={{ background: "none", border: "none", color: isDark ? "#475569" : "#94a3b8", fontSize: 11, cursor: "pointer" }}
          >
            limpar
          </button>
        </div>
      )}

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          {filteredSongs.length} música{filteredSongs.length === 1 ? "" : "s"}
        </h2>
      </div>

      {filteredSongs.length ? (
        <div style={styles.cardGrid}>
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              accessCount={accessCounts[song.id]}
              isDark={isDark}
              onOpen={(songId) => navigate(routes.song(songId))}
            />
          ))}
        </div>
      ) : (
        <div style={styles.empty}>
          Nenhuma música foi encontrada com os filtros selecionados.
        </div>
      )}
    </main>
  );
}
