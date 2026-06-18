import { useMemo, useState, type FormEvent } from "react";
import { navigate } from "../../app/router";
import { routes, songsPathFor } from "../../app/routes";
import SongCard from "../../components/catalog/SongCard";
import { portalStyles } from "../../styles/portalStyles";
import {
  getAllSongs,
  getSongRankingByField,
  getTopSongs,
} from "../../services/songRepository";
import { useSongAccessCounts } from "../song/songAccessStore";

type Props = {
  isDark: boolean;
};

type RankingItem = {
  label: string;
  count: number;
};

function Ranking({
  title,
  items,
  isDark,
  onSelect,
}: {
  title: string;
  items: RankingItem[];
  isDark: boolean;
  onSelect: (label: string) => void;
}) {
  const styles = portalStyles(isDark);

  return (
    <section style={styles.panel}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {items.map((item, index) => (
        <div key={item.label} style={styles.rankingRow}>
          <span style={styles.rank}>{index + 1}</span>
          <button
            type="button"
            onClick={() => onSelect(item.label)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              font: "inherit",
              color: isDark ? "#e2e8f0" : "#1e293b",
              cursor: "pointer",
              textAlign: "left" as const,
              textDecoration: "underline",
              textDecorationColor: isDark ? "rgba(148,163,184,0.4)" : "rgba(100,116,139,0.4)",
              textUnderlineOffset: "3px",
            }}
          >
            {item.label}
          </button>
          <span style={styles.count}>{item.count}</span>
        </div>
      ))}
    </section>
  );
}

export default function HomePage({ isDark }: Props) {
  const songs = getAllSongs();
  const { accessCounts } = useSongAccessCounts();
  const [query, setQuery] = useState("");
  const styles = portalStyles(isDark);
  const featured = useMemo(
    () => getTopSongs(songs, accessCounts, 3),
    [songs, accessCounts],
  );
  const categories = useMemo(
    () => getSongRankingByField(songs, accessCounts, "category"),
    [songs, accessCounts],
  );
  const artists = useMemo(
    () => getSongRankingByField(songs, accessCounts, "artist"),
    [songs, accessCounts],
  );
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(songsPathFor(query));
  };

  return (
    <main style={styles.surface}>
      <section style={{ ...styles.hero, position: "relative", display: "block", maxWidth: "none", marginBottom: "28px" }}>
        <div className="hero-content" style={{ display: "grid", gap: "15px" }}>
          <p style={styles.eyebrow}>Repertório litúrgico</p>
          <h1 style={styles.title}>Encontre a cifra certa para tocar hoje.</h1>
          <p style={styles.description}>
            Consulte músicas por título, artista ou categoria e abra a cifra com
            controles prontos para o ensaio ou a celebração.
          </p>

          {/* Estatísticas em Destaque */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "12px",
              padding: "16px",
              borderRadius: "8px",
              background: isDark
                ? "rgba(30, 41, 59, 0.58)"
                : "rgba(226, 232, 240, 0.5)",
              marginBottom: "20px",
              border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(148, 163, 184, 0.3)"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 120px", minWidth: 100, maxWidth: 220, justifyContent: "center" }}>
              <img
                src="/clave.ico"
                alt="Clave"
                style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: isDark ? "#00d4ff" : "#0099ff", lineHeight: 1.2 }}>
                  {songs.length}+
                </div>
                <div style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#64748b" }}>
                  Cifras
                </div>
              </div>
            </div>

            <div style={{ width: "1px", minHeight: 80, background: isDark ? "rgba(71, 85, 105, 0.5)" : "rgba(148, 163, 184, 0.3)", alignSelf: "center" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 120px", minWidth: 100, maxWidth: 220, justifyContent: "center" }}>
              <span style={{ fontSize: "32px", lineHeight: 1, flexShrink: 0 }}>🎵</span>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600", color: isDark ? "#00d4ff" : "#0099ff", lineHeight: 1.2 }}>
                  {artists.length}+
                </div>
                <div style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#64748b" }}>
                  Artistas
                </div>
              </div>
            </div>

            <div style={{ width: "1px", minHeight: 80, background: isDark ? "rgba(71, 85, 105, 0.5)" : "rgba(148, 163, 184, 0.3)", alignSelf: "center" }} />

            <div style={{ textAlign: "center", flex: "1 1 160px", minWidth: 120, maxWidth: 260 }}>
              <div style={{ fontSize: "24px", marginBottom: "6px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="30" fill={isDark ? "rgba(96, 165, 250, 0.16)" : "rgba(37, 99, 235, 0.12)"} />
                  <path d="M32 19 Q22 20 14 24 L14 45 Q22 41 32 43 Z" fill={isDark ? "rgba(96, 165, 250, 0.10)" : "rgba(37, 99, 235, 0.08)"} stroke={isDark ? "#60a5fa" : "#1d4ed8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M32 19 Q42 20 50 24 L50 45 Q42 41 32 43 Z" fill={isDark ? "rgba(96, 165, 250, 0.10)" : "rgba(37, 99, 235, 0.08)"} stroke={isDark ? "#60a5fa" : "#1d4ed8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="32" y1="19" x2="32" y2="43" stroke={isDark ? "#60a5fa" : "#1d4ed8"} strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  lineHeight: "1.4",
                  color: isDark ? "#e2e8f0" : "#1e293b",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                <div style={{ marginBottom: "6px" }}>
                  "Cantai ao Senhor um cântico novo."
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: isDark ? "#94a3b8" : "#64748b",
                    fontWeight: "400",
                  }}
                >
                  Salmo 96
                </div>
              </div>
            </div>
          </div>

          <form style={styles.searchForm} onSubmit={submitSearch}>
            <input
              aria-label="Buscar músicas"
              placeholder="Buscar por título, artista, tom ou letra..."
              value={query}
              style={styles.input}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" style={styles.primaryButton}>
              Buscar
            </button>
          </form>
        </div>
        <img
          src="/rosario-maria.png"
          alt="Rosário de Maria"
          className="hero-rosario"
        />
      </section>

      <section>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Mais acessadas</h2>
          <button
            type="button"
            style={styles.secondaryAction}
            onClick={() => navigate(routes.songs)}
          >
            Ver todas as músicas
          </button>
        </div>
        <div style={styles.cardGrid}>
          {featured.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              accessCount={accessCounts[song.id]}
              isDark={isDark}
              onOpen={(songId) => navigate(routes.song(songId))}
            />
          ))}
        </div>
      </section>

      <div style={styles.rankingGrid}>
        <Ranking
          title="Top 10 por categoria"
          items={categories}
          isDark={isDark}
          onSelect={(label) => navigate(songsPathFor(label))}
        />
        <Ranking
          title="Top 10 por artista"
          items={artists}
          isDark={isDark}
          onSelect={(label) => navigate(songsPathFor(label))}
        />
      </div>
    </main>
  );
}
