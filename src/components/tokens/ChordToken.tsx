import { songViewerStyles } from "../../styles/songViewerStyles";

type Props = {
  chord: string;
};

export default function ChordToken({ chord }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: "6px",
      }}
    >
      <span style={songViewerStyles.chord}>
        {chord}
      </span>
    </div>
  );
}
