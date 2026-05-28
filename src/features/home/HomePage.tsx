import { useMemo, useState, type FormEvent } from "react";
import { navigate } from "../../app/router";
import { routes, songsPathFor } from "../../app/routes";
import SongCard from "../../components/catalog/SongCard";
import { portalStyles } from "../../styles/portalStyles";
import type { Song } from "../../types/music";
import { useSongCatalog } from "../song/SongCatalogContext";

type Props = {
  isDark: boolean;
};

type RankingItem = {
  label: string;
  count: number;
};

function rankBy(
  songs: Song[],
  accessCounts: Record<string, number>,
  field: "category" | "artist",
) {
  const totals = songs.reduce<Record<string, number>>((result, song) => {
    result[song[field]] = (result[song[field]] ?? 0) + accessCounts[song.id];
    return result;
  }, {});

  return Object.entries(totals)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);
}

function Ranking({
  title,
  items,
  isDark,
}: {
  title: string;
  items: RankingItem[];
  isDark: boolean;
}) {
  const styles = portalStyles(isDark);

  return (
    <section style={styles.panel}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {items.map((item, index) => (
        <div key={item.label} style={styles.rankingRow}>
          <span style={styles.rank}>{index + 1}</span>
          <span>{item.label}</span>
          <span style={styles.count}>{item.count}</span>
        </div>
      ))}
    </section>
  );
}

export default function HomePage({
  isDark,
}: Props) {
  const { songs, accessCounts } = useSongCatalog();
  const [query, setQuery] = useState("");
  const styles = portalStyles(isDark);
  const featured = [...songs]
    .sort((left, right) => accessCounts[right.id] - accessCounts[left.id])
    .slice(0, 3);
  const categories = useMemo(
    () => rankBy(songs, accessCounts, "category"),
    [songs, accessCounts],
  );
  const artists = useMemo(
    () => rankBy(songs, accessCounts, "artist"),
    [songs, accessCounts],
  );

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(songsPathFor(query));
  };

  return (
    <main style={styles.surface}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Repertório litúrgico</p>
        <h1 style={styles.title}>Encontre a cifra certa para tocar hoje.</h1>
        <p style={styles.description}>
          Consulte músicas por título, artista ou categoria e abra a cifra com
          controles prontos para o ensaio ou a celebração.
        </p>
        <form style={styles.searchForm} onSubmit={submitSearch}>
          <input
            aria-label="Buscar músicas"
            placeholder="Buscar por título, artista ou categoria"
            value={query}
            style={styles.input}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" style={styles.primaryButton}>
            Buscar
          </button>
        </form>
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
        />
        <Ranking title="Top 10 por artista" items={artists} isDark={isDark} />
      </div>
    </main>
  );
}
