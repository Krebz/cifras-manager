import { useMantineColorScheme } from "@mantine/core";
import SectionRenderer from "../../../components/renderers/SectionRenderer";
import { songViewerStyles } from "../../../styles/songViewerStyles";
import type { SongDocument } from "../../../types/music";

type Props = {
  songDocument: SongDocument;
  artist: string;
  category: string;
  transpose: number;
  fontSize: number;
  referenceUrl?: string;
};

export default function SongViewer({
  songDocument,
  artist,
  category,
  transpose,
  fontSize,
  referenceUrl,
}: Props) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const styles = songViewerStyles(isDark);

  return (
    <div
      style={{
        ...styles.container,
        fontSize: `${fontSize}px`,
      }}
    >
      <div style={styles.header}>
        <h1 style={styles.title}>{songDocument.title}</h1>
        <div style={styles.artist}>{artist}</div>
        <div style={styles.metaRow}>
          <div style={styles.songKey}>Tom: {songDocument.key}</div>
          <div style={styles.songCategory}>Categoria: {category}</div>
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
              Ver fonte original ↗
            </a>
          </div>
        )}
      </div>

      {songDocument.sections.map((section, index) => (
        <SectionRenderer
          key={index}
          section={section}
          transpose={transpose}
          fontSize={fontSize}
          styles={styles}
        />
      ))}
    </div>
  );
}
