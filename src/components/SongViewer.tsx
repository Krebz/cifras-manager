type Props = {
  title: string
  content: string
}

export default function SongViewer({ title, content }: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <pre>{content}</pre>
    </div>
  )
}
