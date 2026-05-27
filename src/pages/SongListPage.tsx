import { useMemo, useState } from "react";
import SongCard from "../components/catalog/SongCard";
import { portalStyles } from "../styles/portalStyles";
import type { Song } from "../types/music";

type Props = {
  songs: Song[];
  accessCounts: Record<string, number>;
  initialQuery: string;
  isDark: boolean;
  onOpenSong: (songId: string) => void;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function SongListPage({
  songs,
  accessCounts,
  initialQuery,
  isDark,
  onOpenSong,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [artist, setArtist] = useState("");
  const styles = portalStyles(isDark);

  const categories = [...new Set(songs.map((song) => song.category))].sort();
  const artists = [...new Set(songs.map((song) => song.artist))].sort();
  const filteredSongs = useMemo(() => {
    const search = normalize(query.trim());

    return songs
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
      .sort((left, right) => accessCounts[right.id] - accessCounts[left.id]);
  }, [accessCounts, artist, category, query, songs]);

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
        <input
          aria-label="Pesquisar no catálogo"
          placeholder="Título, artista ou categoria"
          value={query}
          style={styles.input}
          onChange={(event) => setQuery(event.target.value)}
        />
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
              onOpen={onOpenSong}
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
