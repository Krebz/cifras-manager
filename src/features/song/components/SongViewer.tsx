import { useMantineColorScheme } from "@mantine/core";
import SectionRenderer from "../../../components/renderers/SectionRenderer";
import { songViewerStyles } from "../../../styles/songViewerStyles";
import { keyPrefersFlat } from "../../../services/transposeChord";
import type { SongDocument } from "../../../types/music";

type Props = {
  songDocument: SongDocument;
  artist: string;
  category: string;
  liturgy?: string;
  capo?: number;
  playedKey?: string;
  transpose: number;
  fontSize: number;
  columns?: 1 | 2;
  referenceUrl?: string;
};

export default function SongViewer({
  songDocument,
  artist,
  category,
  liturgy,
  capo,
  playedKey,
  transpose,
  fontSize,
  columns = 1,
  referenceUrl,
}: Props) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = songViewerStyles(isDark);
  const preferFlat = keyPrefersFlat(playedKey ?? songDocument.key);
  const twoColumns = columns === 2;

  return (
    <div
      style={{
        ...styles.container,
        ...(twoColumns ? { maxWidth: 1700 } : {}),
        fontSize: `${fontSize}px`,
      }}
    >
      <div style={styles.header}>
        <h1 style={styles.title}>{songDocument.title}</h1>
        <div style={styles.artist}>{artist}</div>
        <div style={styles.metaRow}>
          <div style={styles.badgeGreen}>Tom: {songDocument.key}</div>
          {capo ? <div style={styles.badgeGreen}>Capo: {capo}</div> : null}
          {category && <div style={styles.badgeBlue}>Categoria: {category}</div>}
          {liturgy && <div style={styles.badgeBlue}>Liturgia: {liturgy}</div>}
        </div>
        {referenceUrl && (
          <div style={{ marginTop: 6 }}>
            <a
              href={referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: isDark ? "#60a5fa" : "#2563eb",
                fontSize: 12,
                textDecoration: "none",
                borderBottom: `1px solid ${isDark ? "rgba(96,165,250,0.4)" : "rgba(37,99,235,0.4)"}`,
                paddingBottom: 1,
              }}
            >
              Acesso a musica guia ↗
            </a>
          </div>
        )}
      </div>

      <div
        style={
          twoColumns
            ? {
                columnCount: 2,
                columnGap: 24,
                columnRule: isDark
                  ? "1px solid rgba(148,163,184,0.18)"
                  : "1px solid rgba(148,163,184,0.28)",
              }
            : undefined
        }
      >
        {songDocument.sections.map((section, index) => (
          <SectionRenderer
            key={index}
            section={section}
            transpose={transpose}
            fontSize={fontSize}
            styles={styles}
            preferFlat={preferFlat}
          />
        ))}
      </div>
    </div>
  );
}
