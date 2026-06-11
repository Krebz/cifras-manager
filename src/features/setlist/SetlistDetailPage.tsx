import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowUp,
  IconMusic,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import {
  addSongToSetlist,
  getSetlistById,
  moveSongDown,
  moveSongUp,
  removeSongFromSetlist,
} from "../../services/setlistRepository";
import { getAllSongs } from "../../services/songRepository";
import { searchSongs } from "../../services/songRepository";
import { navigate, songInSetlistRouteFor } from "../../app/router";
import { routes } from "../../app/routes";
import type { Setlist } from "../../types/setlist";
import type { Song } from "../../types/music";

type Props = {
  setlistId: string;
  isDark: boolean;
};

export default function SetlistDetailPage({ setlistId, isDark }: Props) {
  const [setlist, setSetlist] = useState<Setlist | null>(() => getSetlistById(setlistId) ?? null);
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [removeTarget, setRemoveTarget] = useState<Song | null>(null);

  const cardBg = isDark ? "rgba(30,41,59,0.8)" : "#fff";
  const cardBorder = isDark ? "1px solid rgba(148,163,184,0.2)" : "1px solid #e2e8f0";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  const allSongs = getAllSongs();
  const catalogSongs = searchQuery.trim()
    ? searchSongs(allSongs, searchQuery)
    : allSongs;

  const songsInSetlist = allSongs.filter((s) => setlist?.songIds.includes(s.id));
  const orderedSongs = setlist
    ? setlist.songIds.map((id) => songsInSetlist.find((s) => s.id === id)).filter(Boolean) as Song[]
    : [];

  const alreadyInSetlist = new Set(setlist?.songIds ?? []);

  function reload() {
    setSetlist(getSetlistById(setlistId) ?? null);
  }

  function handleAdd(songId: string) {
    addSongToSetlist(setlistId, songId);
    reload();
  }

  function handleRemove(song: Song) {
    removeSongFromSetlist(setlistId, song.id);
    reload();
    setRemoveTarget(null);
  }

  function handleMoveUp(songId: string) {
    moveSongUp(setlistId, songId);
    reload();
  }

  function handleMoveDown(songId: string) {
    moveSongDown(setlistId, songId);
    reload();
  }

  function handleStart() {
    if (!setlist || setlist.songIds.length === 0) return;
    navigate(songInSetlistRouteFor(setlist.songIds[0], setlistId));
  }

  if (!setlist) {
    return (
      <Stack align="center" py="xl">
        <Text c="dimmed">Repertório não encontrado.</Text>
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(routes.setlists)}>
          Voltar para repertórios
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group>
        <ActionIcon variant="subtle" onClick={() => navigate(routes.setlists)}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Stack gap={2} style={{ flex: 1 }}>
          <Title order={2} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 20 }}>
            {setlist.name}
          </Title>
          {setlist.date && (
            <Text size="xs" c="dimmed">
              {new Date(setlist.date + "T00:00:00").toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          )}
        </Stack>
      </Group>

      <Group>
        <Button
          leftSection={<IconPlayerPlay size={16} />}
          disabled={orderedSongs.length === 0}
          onClick={handleStart}
        >
          Iniciar repertório
        </Button>
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          onClick={() => setAddOpen(true)}
        >
          Adicionar músicas
        </Button>
      </Group>

      {orderedSongs.length === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <IconMusic size={40} color={textMuted} />
          <Text c="dimmed" size="sm">Nenhuma música neste repertório.</Text>
          <Text c="dimmed" size="xs">Adicione músicas para montar o seu repertório.</Text>
        </Stack>
      )}

      {orderedSongs.map((song, idx) => (
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
          <Text
            size="sm"
            fw={700}
            style={{ color: textMuted, minWidth: 24, textAlign: "center" }}
          >
            {idx + 1}
          </Text>

          <Stack
            gap={2}
            style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
            onClick={() => navigate(songInSetlistRouteFor(song.id, setlistId))}
          >
            <Text fw={600} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 14 }} truncate>
              {song.title}
            </Text>
            <Group gap="xs">
              <Text size="xs" c="dimmed">{song.artist}</Text>
              <Badge size="xs" variant="light">{song.key}</Badge>
            </Group>
          </Stack>

          <Group gap={4}>
            <ActionIcon
              variant="subtle"
              size="sm"
              disabled={idx === 0}
              onClick={() => handleMoveUp(song.id)}
              title="Mover para cima"
            >
              <IconArrowUp size={15} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              size="sm"
              disabled={idx === orderedSongs.length - 1}
              onClick={() => handleMoveDown(song.id)}
              title="Mover para baixo"
            >
              <IconArrowDown size={15} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => setRemoveTarget(song)}
              title="Remover do repertório"
            >
              <IconTrash size={15} />
            </ActionIcon>
          </Group>
        </div>
      ))}

      {/* Modal: adicionar músicas */}
      <Modal
        opened={addOpen}
        onClose={() => { setAddOpen(false); setSearchQuery(""); }}
        title="Adicionar músicas"
        size="md"
      >
        <Stack gap="sm">
          <TextInput
            placeholder="Pesquisar por título, artista..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            autoFocus
          />
          <Stack gap="xs" style={{ maxHeight: 360, overflowY: "auto" }}>
            {catalogSongs.map((song) => {
              const inList = alreadyInSetlist.has(song.id);
              return (
                <Group
                  key={song.id}
                  justify="space-between"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: isDark ? "rgba(30,41,59,0.6)" : "#f8fafc",
                    border: isDark ? "1px solid rgba(148,163,184,0.15)" : "1px solid #e2e8f0",
                    opacity: inList ? 0.5 : 1,
                  }}
                >
                  <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" fw={600} style={{ color: isDark ? "#e2e8f0" : "#1e293b" }} truncate>
                      {song.title}
                    </Text>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">{song.artist}</Text>
                      <Badge size="xs" variant="light">{song.key}</Badge>
                    </Group>
                  </Stack>
                  <Button
                    size="xs"
                    variant={inList ? "subtle" : "light"}
                    disabled={inList}
                    onClick={() => handleAdd(song.id)}
                  >
                    {inList ? "Adicionada" : "Adicionar"}
                  </Button>
                </Group>
              );
            })}
            {catalogSongs.length === 0 && (
              <Text c="dimmed" size="sm" ta="center" py="md">Nenhuma música encontrada.</Text>
            )}
          </Stack>
        </Stack>
      </Modal>

      {/* Modal: confirmar remoção */}
      <Modal
        opened={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Remover música"
        size="sm"
      >
        <Stack gap="sm">
          <Text size="sm">
            Remover <strong>{removeTarget?.title}</strong> do repertório?
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setRemoveTarget(null)}>Cancelar</Button>
            <Button color="red" onClick={() => removeTarget && handleRemove(removeTarget)}>
              Remover
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
