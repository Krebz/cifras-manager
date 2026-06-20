import { useEffect, useState } from "react";
import { navigate } from "../../app/router";
import { routes } from "../../app/routes";
import SongCard from "../../components/catalog/SongCard";
import { useSongCatalog } from "../../hooks/useSongCatalog";
import { getSetlists } from "../../services/setlistRepository";
import { portalStyles } from "../../styles/portalStyles";
import { useSongAccessCounts } from "./songAccessStore";

const HISTORY_KEY = "cifras_search_history";
const MAX_HISTORY = 5;
const PAGE_SIZE = 12;

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
  } = useSongCatalog({ accessCounts, initialQuery });
  const styles = portalStyles(isDark);
  const [history, setHistory] = useState<string[]>(getHistory);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const setlists = getSetlists();

  useEffect(() => {
    if (query.length < 2) return;
    const t = setTimeout(() => {
      addToHistory(query);
      setHistory(getHistory());
    }, 2000);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category, liturgy, artist]);

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
        {liturgies.length > 0 && (
          <select
            aria-label="Filtrar por uso litúrgico"
            value={liturgy}
            style={styles.select}
            onChange={(event) => setLiturgy(event.target.value)}
          >
            <option value="">Todos os momentos</option>
            {liturgies.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        )}
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px 16px",
          marginBottom: "13px",
          padding: "8px 12px",
          borderRadius: "10px",
          background: isDark ? "rgba(30,41,59,0.45)" : "rgba(226,232,240,0.4)",
          border: `1px solid ${isDark ? "rgba(148,163,184,0.15)" : "rgba(148,163,184,0.22)"}`,
        }}
      >
        {(() => {
          const statStyle: React.CSSProperties = { fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 };
          const divStyle: React.CSSProperties = { color: isDark ? "rgba(148,163,184,0.3)" : "rgba(148,163,184,0.45)", userSelect: "none" };
          return (
            <>
              <span style={statStyle}>
                <img src="/icons/clave-32.png" alt="" style={{ width: 18, height: 18, flexShrink: 0 }} />
                {filteredSongs.length} música{filteredSongs.length === 1 ? "" : "s"}
              </span>
              <span style={divStyle}>|</span>
              <span style={statStyle}>
                🎵 {artists.length} artista{artists.length === 1 ? "" : "s"}
              </span>
              <span style={divStyle}>|</span>
              <span style={statStyle}>
                📋 {setlists.length} repertório{setlists.length === 1 ? "" : "s"}
              </span>
            </>
          );
        })()}
      </div>

      {filteredSongs.length ? (
        <>
          <div style={styles.cardGrid}>
            {filteredSongs.slice(0, visibleCount).map((song) => (
              <SongCard
                key={song.id}
                song={song}
                accessCount={accessCounts[song.id]}
                isDark={isDark}
                onOpen={(songId) => navigate(routes.song(songId))}
              />
            ))}
          </div>
          {visibleCount < filteredSongs.length && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                style={styles.secondaryAction}
              >
                Carregar mais · {filteredSongs.length - visibleCount} restantes
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={styles.empty}>
          Nenhuma música foi encontrada com os filtros selecionados.
        </div>
      )}
    </main>
  );
}
