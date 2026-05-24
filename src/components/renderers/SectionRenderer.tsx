import type { SongSection } from "../../types/music";

import LineRenderer from "./LineRenderer";

import { songViewerStyles } from "../../styles/songViewerStyles";

type Props = {
  section: SongSection;
  transpose: number;
};

export default function SectionRenderer({ section, transpose }: Props) {
  const isChorus = section.type === "chorus";

  return (
    <div
      style={{
        ...songViewerStyles.section,

        ...(isChorus
          ? songViewerStyles.chorusSection
          : {}),
      }}
    >
      {/* nome da seção */}
      <div
        style={songViewerStyles.sectionTitle}
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
