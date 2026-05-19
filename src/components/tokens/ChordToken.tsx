type Props = {
  chord: string;
};

export default function ChordToken({ chord }: Props) {
  return (
    <span
      style={{
        color: "#2b6cb0",
        fontWeight: "bold",
        marginRight: "4px",
      }}
    >
      {chord}
    </span>
  );
}
