import { useMemo, useState } from "react";
import { Button, Group, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { parseSong } from "../../utils/parseSong";
import { convertNaturalToChordPro } from "../../utils/importChords";
import SongViewer from "../song/components/SongViewer";
import type { Song } from "../../types/music";

const KEYS = [
  "C", "Cm", "C#", "C#m",
  "D", "Dm", "Eb", "E", "Em",
  "F", "Fm", "F#", "F#m",
  "G", "Gm", "Ab", "A", "Am",
  "Bb", "Bbm", "B", "Bm",
];

const IMPORT_PLACEHOLDER = `Refrão:
    G          D        Em
Senhor meu Deus, quan-do eu

    C          G
olho os céus

Verso:
    G               D
Discípulo amado do Senhor`;

type FormData = Omit<Song, "id" | "accessCount">;

type Props = {
  initial?: Song;
  isDark: boolean;
  onSave: (data: FormData) => void;
  onCancel: () => void;
};

export default function SongForm({ initial, isDark, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [key, setKey] = useState(initial?.key ?? "G");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [referenceUrl, setReferenceUrl] = useState(initial?.referenceUrl ?? "");

  const [importing, setImporting] = useState(false);
  const [importText, setImportText] = useState("");

  const previewDoc = useMemo(
    () => (title || content ? parseSong(title || "Prévia", key, content) : null),
    [title, key, content],
  );

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    onSave({
      title: title.trim(),
      artist: artist.trim(),
      key,
      category: category.trim(),
      content,
      referenceUrl: referenceUrl.trim() || undefined,
    });
  }

  function handleConvert() {
    const converted = convertNaturalToChordPro(importText);
    setContent(converted);
    setImportText("");
    setImporting(false);
  }

  const previewBg = isDark ? "rgba(15,23,42,0.6)" : "#f8fafc";
  const previewBorder = isDark ? "1px solid rgba(148,163,184,0.15)" : "1px solid #e2e8f0";
  const labelColor = isDark ? "#94a3b8" : "#64748b";
  const importBg = isDark ? "rgba(59,130,246,0.06)" : "rgba(37,99,235,0.04)";
  const importBorder = isDark ? "1px solid rgba(96,165,250,0.2)" : "1px solid rgba(37,99,235,0.15)";

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
          gap: 24,
        }}
        className="song-form-grid"
      >
        {/* Campos */}
        <Stack gap="sm">
          <TextInput
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
          <TextInput
            label="Artista / Intérprete"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
          <Group grow gap="sm">
            <Select
              label="Tom"
              value={key}
              onChange={(v) => v && setKey(v)}
              data={KEYS}
              required
              allowDeselect={false}
            />
            <TextInput
              label="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Entrada, Comunhão..."
              required
            />
          </Group>

          <TextInput
            label="Link de referência (opcional)"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="https://cifraclub.com.br/..."
            type="url"
          />

          {/* Painel de importação */}
          {importing ? (
            <div style={{ borderRadius: 8, border: importBorder, background: importBg, padding: 12 }}>
              <Text size="sm" fw={500} mb={4}>
                Cole a cifra no formato tradicional
              </Text>
              <Text size="xs" c="dimmed" mb={8}>
                Acordes acima das letras. Marcadores como "Refrão:" e "Verso:" são convertidos automaticamente.
              </Text>
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={IMPORT_PLACEHOLDER}
                minRows={8}
                autosize
                maxRows={20}
                autoFocus
                styles={{ input: { fontFamily: "monospace", fontSize: 12, lineHeight: 1.6 } }}
              />
              <Group mt="xs" gap="xs">
                <Button
                  size="xs"
                  leftSection={<IconDownload size={13} />}
                  onClick={handleConvert}
                  disabled={!importText.trim()}
                >
                  Converter
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => { setImporting(false); setImportText(""); }}
                >
                  Cancelar
                </Button>
              </Group>
            </div>
          ) : (
            <div>
              <Button
                size="xs"
                variant="subtle"
                leftSection={<IconDownload size={13} />}
                onClick={() => setImporting(true)}
                style={{ marginBottom: 4 }}
              >
                Importar do formato tradicional
              </Button>
            </div>
          )}

          <Textarea
            label="Cifra"
            description='Use [Acorde] antes das sílabas. Ex: [G]Se[D]nhor'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minRows={importing ? 6 : 16}
            autosize
            maxRows={40}
            styles={{ input: { fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 } }}
          />
          <Group justify="flex-end" mt="xs">
            <Button variant="subtle" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </Group>
        </Stack>

        {/* Prévia */}
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: 1, color: labelColor, textTransform: "uppercase" }}>
            Prévia
          </p>
          <div
            style={{
              position: "sticky",
              top: 0,
              maxHeight: "85vh",
              overflowY: "auto",
              borderRadius: 8,
              border: previewBorder,
              background: previewBg,
              padding: 12,
            }}
          >
            {previewDoc ? (
              <SongViewer
                songDocument={previewDoc}
                artist={artist}
                category={category}
                transpose={0}
                fontSize={14}
                referenceUrl={referenceUrl.trim() || undefined}
              />
            ) : (
              <p style={{ color: labelColor, fontSize: 14, padding: 8 }}>
                Preencha o título e a cifra para ver a prévia.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .song-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
