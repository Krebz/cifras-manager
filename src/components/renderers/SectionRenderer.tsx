import type { SongSection } from "../../types/music";

import LineRenderer from "./LineRenderer";

type Props = {
  section: SongSection;
  transpose: number;
};

export default function SectionRenderer({ section, transpose }: Props) {
  const isChorus = section.type === "chorus";

  return (
    <div
      style={{
        marginBottom: "32px",
        padding: isChorus ? "16px" : "0",
        backgroundColor: isChorus ? "#f1f5f9" : "transparent",
        borderRadius: "8px",
      }}
    >
      {/* nome da seção */}
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "12px",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {section.type}
      </div>

      {/* linhas */}
      {section.lines.map((line, index) => (
        <LineRenderer key={index} line={line} transpose={transpose} />
      ))}
    </div>
  );
}
