import type { SongSection } from "../../types/music";
import LineRenderer from "./LineRenderer";
import { getSectionLabel } from "../../utils/getSectionLabel";

type Props = {
  section: SongSection;
  transpose: number;
  fontSize: number;
  styles: any;
};

export default function SectionRenderer({
  section,
  transpose,
  fontSize,
  styles,
}: Props) {
  const isChorus = section.type === "chorus";

  return (
    <div
      style={{
        ...styles.section,

        ...(isChorus ? styles.chorusSection : {}),
      }}
    >
      {/* nome da seção */}
      <div style={styles.sectionTitle}>{getSectionLabel(section.type)}</div>

      {/* linhas */}
      {section.lines.map((line, index) => {
        const isEven = index % 2 === 0;

        return (
          <div
            key={index}
            style={{
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
              fontSize={fontSize}
            />
          </div>
        );
      })}
    </div>
  );
}
