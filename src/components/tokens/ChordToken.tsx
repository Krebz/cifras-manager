import { songViewerStyles } from "../../styles/songViewerStyles";

type Props = {
  chord: string;
};

export default function ChordToken({ chord }: Props) {
  return (
    <span
      style={songViewerStyles.chord}
    >
      {chord}
    </span>
  );
}
