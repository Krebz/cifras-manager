type Props = {
  text: string;
};

export default function TextToken({ text }: Props) {
  return <span
  style={{
    whiteSpace: "pre",
  }}
>
  {text}
</span>
}
