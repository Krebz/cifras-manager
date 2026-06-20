import type { Song } from "../../types/music";
import { portalStyles } from "../../styles/portalStyles";

type Props = {
  song: Song;
  accessCount: number;
  isDark: boolean;
  onOpen: (songId: string) => void;
};

export default function SongCard({
  song,
  accessCount,
  isDark,
  onOpen,
}: Props) {
  const styles = portalStyles(isDark);

  return (
    <article style={styles.songCard}>
      <h3
        style={{ ...styles.songName, cursor: "pointer" }}
        onClick={() => onOpen(song.id)}
      >
        {song.title}
      </h3>
      <p style={styles.mutedText}>{song.artist}</p>
      <div style={styles.metadata}>
        {song.category && <span style={styles.badge}>{song.category}</span>}
        {song.liturgy && <span style={styles.badge}>{song.liturgy}</span>}
        <span style={styles.badge}>Tom {song.key}</span>
        <span style={styles.badge}>{accessCount} acessos</span>
      </div>
      <button
        type="button"
        style={styles.cardAction}
        onClick={() => onOpen(song.id)}
      >
        Abrir cifra
      </button>
    </article>
  );
}
