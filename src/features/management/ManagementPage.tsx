import { useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconDownload, IconEdit, IconMusic, IconPlus, IconSearch, IconTrash, IconX } from "@tabler/icons-react";
import {
  createSong,
  deleteSong,
  fetchSongs,
  getAllSongs,
  updateSong,
} from "../../services/songRepository";
import type { Song } from "../../types/music";
import SongForm from "./SongForm";

const PAGE_SIZE = 20;

type Props = { isDark: boolean };
type View = { kind: "list" } | { kind: "form"; song?: Song };

export default function ManagementPage({ isDark }: Props) {
  const [songs, setSongs] = useState<Song[]>(() => getAllSongs());
  const [view, setView] = useState<View>({ kind: "list" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    fetchSongs().then(setSongs).catch(() => {});
  }, []);

  const cardBg = isDark ? "rgba(30,41,59,0.8)" : "#fff";
  const cardBorder = isDark ? "1px solid rgba(148,163,184,0.2)" : "1px solid #e2e8f0";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  function handleExport() {
    const lines: string[] = [
      `import type { Song } from "../types/music";`,
      ``,
      `export const songs: Song[] = [`,
    ];

    for (const song of songs) {
      const content = song.content
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$\{/g, "\\${");

      lines.push(`  {`);
      lines.push(`    id: ${JSON.stringify(song.id)},`);
      lines.push(`    title: ${JSON.stringify(song.title)},`);
      lines.push(`    artist: ${JSON.stringify(song.artist)},`);
      lines.push(`    key: ${JSON.stringify(song.key)},`);
      lines.push(`    category: ${JSON.stringify(song.category)},`);
      if (song.liturgy) {
        lines.push(`    liturgy: ${JSON.stringify(song.liturgy)},`);
      }
      lines.push(`    accessCount: ${song.accessCount},`);
      if (song.referenceUrl) {
        lines.push(`    referenceUrl: ${JSON.stringify(song.referenceUrl)},`);
      }
      lines.push(`    content: \`${content}\`,`);
      lines.push(`  },`);
    }

    lines.push(`];`);
    lines.push(``);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "songs.ts";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSave(data: Omit<Song, "id" | "accessCount">) {
    if (view.kind === "form") {
      if (view.song) {
        const updated = await updateSong(view.song.id, data);
        setSongs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await createSong(data);
        setSongs((prev) => [...prev, created]);
      }
    }
    setView({ kind: "list" });
  }

  async function handleDelete(id: string) {
    await deleteSong(id);
    setSongs((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  }

  // --- Vista: formulário ---
  if (view.kind === "form") {
    const isEdit = !!view.song;
    return (
      <Stack gap="md">
        <Group>
          <ActionIcon variant="subtle" onClick={() => setView({ kind: "list" })}>
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Title order={2} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 20 }}>
            {isEdit ? `Editando: ${view.song!.title}` : "Nova cifra"}
          </Title>
        </Group>

        <SongForm
          initial={view.song}
          isDark={isDark}
          onSave={handleSave}
          onCancel={() => setView({ kind: "list" })}
        />
      </Stack>
    );
  }

  // --- Vista: lista ---
  const filtered = songs.filter((s) => {
    const q = query.trim().toLowerCase();
    return !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q);
  });
  const visibleSongs = filtered.slice(0, visibleCount);

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Title order={2} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 22 }}>
            Gestão de cifras
          </Title>
          <Text size="sm" c="dimmed">
            {songs.length} música{songs.length !== 1 ? "s" : ""} cadastrada{songs.length !== 1 ? "s" : ""}
          </Text>
        </Stack>
        <Group gap="xs">
          <Button
            variant="subtle"
            leftSection={<IconDownload size={16} />}
            onClick={handleExport}
            disabled={songs.length === 0}
            title="Baixa songs.ts com todas as músicas para substituir src/data/songs.ts"
          >
            Exportar songs.ts
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setView({ kind: "form" })}>
            Nova cifra
          </Button>
        </Group>
      </Group>

      <TextInput
        placeholder="Buscar por título ou artista..."
        value={query}
        onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
        leftSection={<IconSearch size={15} />}
        rightSection={query ? (
          <ActionIcon variant="subtle" size="sm" onClick={() => setQuery("")}>
            <IconX size={13} />
          </ActionIcon>
        ) : null}
      />

      {songs.length === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <IconMusic size={40} color={textMuted} />
          <Text c="dimmed" size="sm">Nenhuma cifra cadastrada ainda.</Text>
          <Button variant="light" leftSection={<IconPlus size={16} />} onClick={() => setView({ kind: "form" })}>
            Cadastrar primeira cifra
          </Button>
        </Stack>
      )}

      {songs.length > 0 && filtered.length === 0 && (
        <Text c="dimmed" size="sm" ta="center" py="md">
          Nenhuma música encontrada para "{query}".
        </Text>
      )}

      <Stack gap="xs">
        {visibleSongs.map((song) => (
          <div
            key={song.id}
            style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: 10,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 14 }} truncate>
                {song.title}
              </Text>
              <Group gap="xs">
                <Text size="xs" c="dimmed">{song.artist}</Text>
                <Badge size="xs" variant="light">{song.key}</Badge>
                {song.category && <Badge size="xs" variant="light" color="green">{song.category}</Badge>}
                {song.liturgy && <Badge size="xs" variant="light" color="violet">{song.liturgy}</Badge>}
              </Group>
            </Stack>

            {/* Confirmação inline de exclusão */}
            {deleteConfirm === song.id ? (
              <Group gap="xs" style={{ flexShrink: 0 }}>
                <Text size="xs" c="dimmed">Excluir?</Text>
                <Button size="xs" color="red" onClick={() => handleDelete(song.id)}>Sim</Button>
                <Button size="xs" variant="subtle" onClick={() => setDeleteConfirm(null)}>Não</Button>
              </Group>
            ) : (
              <Group gap={4} style={{ flexShrink: 0 }}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => setView({ kind: "form", song })}
                  title="Editar"
                >
                  <IconEdit size={15} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => setDeleteConfirm(song.id)}
                  title="Excluir"
                >
                  <IconTrash size={15} />
                </ActionIcon>
              </Group>
            )}
          </div>
        ))}
      </Stack>

      {visibleCount < filtered.length && (
        <Group justify="center" mt="sm">
          <Button
            variant="subtle"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Carregar mais · {filtered.length - visibleCount} restantes
          </Button>
        </Group>
      )}
    </Stack>
  );
}
