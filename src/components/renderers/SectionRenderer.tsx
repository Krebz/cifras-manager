import type { SongSection } from "../../types/music";
import type { songViewerStyles } from "../../styles/songViewerStyles";
import LineRenderer from "./LineRenderer";
import { getSectionLabel } from "../../utils/getSectionLabel";

type Props = {
  section: SongSection;
  transpose: number;
  fontSize: number;
  styles: ReturnType<typeof songViewerStyles>;
  preferFlat?: boolean;
};

export default function SectionRenderer({
  section,
  transpose,
  fontSize,
  styles,
  preferFlat = false,
}: Props) {
  const isChorus = section.type === "chorus";
  const isBridge = section.type === "bridge";
  const isNote  = section.type === "note";

  const noteFontSize = Math.round(fontSize * 0.82);

  return (
    <div
      style={{
        ...styles.section,
        ...(isChorus ? styles.chorusSection : {}),
        ...(isBridge ? styles.bridgeSection : {}),
        ...(isNote   ? styles.noteSection   : {}),
      }}
    >
      {!isNote && (
        <div style={styles.sectionTitle}>{getSectionLabel(section.type)}</div>
      )}

      <div style={styles.sectionScroll}>
        {section.lines.map((line, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              style={isNote ? undefined : {
                backgroundColor: isEven
                  ? "rgba(255,255,255,0.02)"
                  : "transparent",
                borderRadius: "6px",
                padding: "4px 8px",
              }}
            >
              <LineRenderer
                line={line}
                transpose={transpose}
                fontSize={isNote ? noteFontSize : fontSize}
                preferFlat={preferFlat}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
