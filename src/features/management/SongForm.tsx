import { useMemo, useState } from "react";
import { Autocomplete, Button, Group, Select, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { parseSong } from "../../utils/parseSong";
import { convertNaturalToChordPro } from "../../utils/importChords";
import { getAllSongs } from "../../services/songRepository";
import { transposeKey } from "../../services/transposeKey";
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

const CAPO_OPTIONS = [
  { value: "0", label: "Sem capo" },
  { value: "1", label: "Capo 1" },
  { value: "2", label: "Capo 2" },
  { value: "3", label: "Capo 3" },
  { value: "4", label: "Capo 4" },
  { value: "5", label: "Capo 5" },
  { value: "6", label: "Capo 6" },
  { value: "7", label: "Capo 7" },
];

type FormData = Omit<Song, "id" | "accessCount">;

type Props = {
  initial?: Song;
  isDark: boolean;
  onSave: (data: FormData) => void;
  onCancel: () => void;
};

const allSongs = getAllSongs();
const existingCategories = [...new Set(allSongs.map((s) => s.category).filter(Boolean))].sort();
const existingArtists    = [...new Set(allSongs.map((s) => s.artist).filter(Boolean))].sort();
const existingLiturgies  = [...new Set(allSongs.map((s) => s.liturgy).filter(Boolean) as string[])].sort();

export default function SongForm({ initial, isDark, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [key, setKey] = useState(initial?.key ?? "G");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [liturgy, setLiturgy] = useState(initial?.liturgy ?? "");
  const [capo, setCapo] = useState(String(initial?.capo ?? 0));
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
    const capoNum = parseInt(capo, 10);
    onSave({
      title: title.trim(),
      artist: artist.trim(),
      key,
      category: category.trim(),
      liturgy: liturgy.trim() || undefined,
      capo: capoNum > 0 ? capoNum : undefined,
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
          <Autocomplete
            label="Artista / Intérprete"
            value={artist}
            onChange={setArtist}
            data={existingArtists}
            placeholder="Selecione ou digite novo..."
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
            <Autocomplete
              label="Categoria musical"
              value={category}
              onChange={setCategory}
              data={existingCategories}
              placeholder="Louvor, Adoração..."
            />
          </Group>

          <Group grow gap="sm">
            <Autocomplete
              label="Uso litúrgico (opcional)"
              value={liturgy}
              onChange={setLiturgy}
              data={existingLiturgies}
              placeholder="Entrada, Ofertório, Comunhão..."
            />
            <Select
              label="Capotraste (opcional)"
              value={capo}
              onChange={(v) => setCapo(v ?? "0")}
              data={CAPO_OPTIONS}
              allowDeselect={false}
            />
          </Group>

          <TextInput
            label="Link de referência (opcional)"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder="https://youtube.com/..."
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
            description='Use [Acorde] antes das sílabas. Ex: [G]Se[D]nhor · Ênfase: **negrito** e _itálico_'
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
                liturgy={liturgy.trim() || undefined}
                capo={parseInt(capo, 10) > 0 ? parseInt(capo, 10) : undefined}
                playedKey={parseInt(capo, 10) > 0 ? transposeKey(key, -parseInt(capo, 10)) : key}
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
