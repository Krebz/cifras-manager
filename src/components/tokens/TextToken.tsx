type Props = {
  text: string;
};

export default function TextToken({ text }: Props) {
  return <span>{text}</span>;
}
