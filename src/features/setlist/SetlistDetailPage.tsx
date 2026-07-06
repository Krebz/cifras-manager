import { useEffect, useState, type CSSProperties } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBrandGoogle,
  IconCheck,
  IconDeviceFloppy,
  IconGripVertical,
  IconMusic,
  IconPencil,
  IconPlayerPlay,
  IconPlus,
  IconSearch,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  addSongToSetlist,
  createSetlist,
  fetchSetlistById,
  fetchSetlists,
  getSetlistById,
  removeSongFromSetlist,
  updateSetlist,
} from "../../services/setlistRepository";
import { fetchSongs, getAllSongs, searchSongs } from "../../services/songRepository";
import { navigate, songInSetlistRouteFor } from "../../app/router";
import { routes } from "../../app/routes";
import type { Setlist } from "../../types/setlist";
import type { Song } from "../../types/music";
import { buildShareUrl, stashPendingShare } from "../../services/setlistShare";
import { useUser } from "../../contexts/UserContext";

type Props = {
  setlistId: string;
  isDark: boolean;
};

export default function SetlistDetailPage({ setlistId, isDark }: Props) {
  const { user } = useUser();
  const [setlist, setSetlist] = useState<Setlist | null>(() => getSetlistById(setlistId) ?? null);
  const [allSongs, setAllSongs] = useState<Song[]>(() => getAllSongs());
  const [isOwner, setIsOwner] = useState(false);
  const [savedCopyId, setSavedCopyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [removeTarget, setRemoveTarget] = useState<Song | null>(null);
  const [shared, setShared] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    fetchSongs().then(setAllSongs).catch(() => {});
  }, []);

  // Descobre se o usuário é dono deste repertório (está na lista dele) ou se é
  // uma visualização compartilhada (busca pública por id). Também deduplica:
  // se já salvou uma cópia deste link, guarda o id da cópia.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      let mine: Setlist[] = [];
      if (user) mine = await fetchSetlists().catch(() => []);
      if (cancelled) return;

      const owned = mine.find((s) => s.id === setlistId);
      if (owned) {
        setSetlist(owned);
        setIsOwner(true);
        setSavedCopyId(null);
        setLoading(false);
        return;
      }

      const sharedSetlist = await fetchSetlistById(setlistId).catch(() => null);
      if (cancelled) return;
      setSetlist(sharedSetlist);
      setIsOwner(false);
      const copy = mine.find((s) => s.sourceId === setlistId);
      setSavedCopyId(copy ? copy.id : null);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [setlistId, user]);

  const textMuted = isDark ? "#94a3b8" : "#64748b";

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

  async function handleAdd(songId: string) {
    await addSongToSetlist(setlistId, songId);
    reload();
  }

  async function handleRemove(song: Song) {
    await removeSongFromSetlist(setlistId, song.id);
    reload();
    setRemoveTarget(null);
  }

  // Arraste pela alça (ícone ≡): clique-e-arraste no PC (MouseSensor) e toque-e-
  // arraste no tablet/celular (TouchSensor). Sensores separados evitam conflito
  // no touch; a alça tem touch-action:none para o navegador não roubar o gesto.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!setlist || !over || active.id === over.id) return;
    const oldIndex = setlist.songIds.indexOf(String(active.id));
    const newIndex = setlist.songIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const songIds = arrayMove(setlist.songIds, oldIndex, newIndex);
    setSetlist({ ...setlist, songIds }); // otimista
    await updateSetlist({ ...setlist, songIds });
    reload();
  }

  function handleShare() {
    if (!setlist) return;
    navigator.clipboard?.writeText(buildShareUrl(setlist)).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  }

  function openEdit() {
    if (!setlist) return;
    setEditName(setlist.name);
    setEditDate(setlist.date ?? "");
    setEditOpen(true);
  }

  async function handleRename() {
    if (!setlist || !editName.trim()) return;
    await updateSetlist({ ...setlist, name: editName.trim(), date: editDate || undefined });
    setEditOpen(false);
    reload();
  }

  function handleStart() {
    if (!setlist || setlist.songIds.length === 0) return;
    navigate(songInSetlistRouteFor(setlist.songIds[0], setlistId));
  }

  // Visualização compartilhada: salva uma cópia no usuário logado (com sourceId
  // para deduplicar) e abre a cópia própria.
  async function handleSaveCopy() {
    if (!setlist) return;
    setSaving(true);
    try {
      const copy = await createSetlist(setlist.name, setlist.date, setlist.songIds, setlistId);
      navigate(routes.setlist(copy.id));
    } catch {
      // silencioso — o botão volta ao estado normal e o usuário pode tentar de novo
    } finally {
      setSaving(false);
    }
  }

  function handleLoginToSave() {
    stashPendingShare(setlistId);
    window.location.href = "/api/auth/google";
  }

  if (loading && !setlist) {
    return (
      <Stack align="center" py="xl">
        <Loader size="sm" />
      </Stack>
    );
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
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
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
        {isOwner && (
          <ActionIcon variant="subtle" onClick={openEdit} title="Editar nome/data">
            <IconPencil size={18} />
          </ActionIcon>
        )}
      </Group>

      {/* Visualização compartilhada — ver ou salvar (sem duplicar) */}
      {!isOwner && (
        <div
          style={{
            background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)",
            border: isDark ? "1px solid rgba(96,165,250,0.35)" : "1px solid rgba(37,99,235,0.25)",
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
            <Text size="sm" style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}>
              {savedCopyId
                ? "Você já salvou este repertório nos seus."
                : "Repertório compartilhado — você pode visualizar e iniciar."}
            </Text>
            {savedCopyId ? (
              <Button
                size="xs"
                variant="light"
                onClick={() => navigate(routes.setlist(savedCopyId))}
                style={{ flexShrink: 0 }}
              >
                Abrir meu repertório
              </Button>
            ) : user ? (
              <Button
                size="xs"
                leftSection={<IconDeviceFloppy size={15} />}
                loading={saving}
                onClick={handleSaveCopy}
                style={{ flexShrink: 0 }}
              >
                Salvar nos meus
              </Button>
            ) : (
              <Button
                size="xs"
                variant="default"
                leftSection={<IconBrandGoogle size={15} />}
                onClick={handleLoginToSave}
                style={{ flexShrink: 0 }}
              >
                Entrar para salvar
              </Button>
            )}
          </Group>
        </div>
      )}

      <Group>
        <Button
          leftSection={<IconPlayerPlay size={16} />}
          disabled={orderedSongs.length === 0}
          onClick={handleStart}
        >
          Iniciar repertório
        </Button>
        {isOwner && (
          <>
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={() => setAddOpen(true)}
            >
              Adicionar músicas
            </Button>
            <Button
              variant="subtle"
              leftSection={shared ? <IconCheck size={16} /> : <IconShare size={16} />}
              disabled={orderedSongs.length === 0}
              onClick={handleShare}
            >
              {shared ? "Link copiado!" : "Compartilhar"}
            </Button>
          </>
        )}
      </Group>

      {orderedSongs.length === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <IconMusic size={40} color={textMuted} />
          <Text c="dimmed" size="sm">Nenhuma música neste repertório.</Text>
          {isOwner && (
            <Text c="dimmed" size="xs">Adicione músicas para montar o seu repertório.</Text>
          )}
        </Stack>
      )}

      {isOwner ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedSongs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <Stack gap="md">
              {orderedSongs.map((song, idx) => (
                <SortableSongRow
                  key={song.id}
                  song={song}
                  index={idx}
                  isDark={isDark}
                  onOpen={() => navigate(songInSetlistRouteFor(song.id, setlistId))}
                  onRemove={() => setRemoveTarget(song)}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      ) : (
        orderedSongs.map((song, idx) => (
          <SongRow
            key={song.id}
            song={song}
            index={idx}
            isDark={isDark}
            onOpen={() => navigate(songInSetlistRouteFor(song.id, setlistId))}
          />
        ))
      )}

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
                      <Badge size="xs" variant="light" color="green">{song.key}</Badge>
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

      {/* Modal: editar nome/data */}
      <Modal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar repertório"
        size="sm"
      >
        <Stack gap="sm">
          <TextInput
            label="Nome"
            placeholder="Ex: Missa Domingo 10h"
            value={editName}
            onChange={(e) => setEditName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
            required
          />
          <TextInput
            label="Data (opcional)"
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="xs">
            <Button variant="subtle" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleRename} disabled={!editName.trim()}>Salvar</Button>
          </Group>
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

function rowCardStyle(isDark: boolean): CSSProperties {
  return {
    background: isDark ? "rgba(30,41,59,0.8)" : "#fff",
    border: isDark ? "1px solid rgba(148,163,184,0.2)" : "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
  };
}

type RowProps = {
  song: Song;
  index: number;
  isDark: boolean;
  onOpen: () => void;
  onRemove?: () => void;
};

// Conteúdo compartilhado da linha (número + título/metadados clicáveis).
function RowContent({ song, index, isDark, onOpen }: Omit<RowProps, "onRemove">) {
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  return (
    <>
      <Text size="sm" fw={700} style={{ color: textMuted, minWidth: 24, textAlign: "center" }}>
        {index + 1}
      </Text>
      <Stack
        gap={2}
        style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
        onClick={onOpen}
      >
        <Text fw={600} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 14 }} truncate>
          {song.title}
        </Text>
        <Group gap="xs">
          {song.liturgy && <Badge size="xs" variant="light" color="blue">{song.liturgy}</Badge>}
          <Text size="xs" c="dimmed">{song.artist}</Text>
          <Badge size="xs" variant="light" color="green">{song.key}</Badge>
        </Group>
      </Stack>
    </>
  );
}

// Linha estática (visualização compartilhada — sem reordenar/remover).
function SongRow({ song, index, isDark, onOpen }: RowProps) {
  return (
    <div style={rowCardStyle(isDark)}>
      <RowContent song={song} index={index} isDark={isDark} onOpen={onOpen} />
    </div>
  );
}

// Linha reordenável (dono): arraste pela alça ≡ à esquerda. O resto da linha
// rola normalmente; o toque curto no título abre a música e o lixo remove.
function SortableSongRow({ song, index, isDark, onOpen, onRemove }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });
  const style: CSSProperties = {
    ...rowCardStyle(isDark),
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    zIndex: isDragging ? 2 : undefined,
    boxShadow: isDragging
      ? "0 12px 28px rgba(0,0,0,0.45)"
      : (isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)"),
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Arraste para reordenar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "stretch",
          // alvo de toque generoso, preenchendo a altura do card
          padding: "0 10px",
          margin: "-12px -4px -12px -14px",
          touchAction: "none",
          cursor: "grab",
          color: isDark ? "#64748b" : "#94a3b8",
          flexShrink: 0,
        }}
      >
        <IconGripVertical size={18} />
      </div>
      <RowContent song={song} index={index} isDark={isDark} onOpen={onOpen} />
      <ActionIcon
        variant="subtle"
        color="red"
        size="sm"
        onClick={onRemove}
        title="Remover do repertório"
      >
        <IconTrash size={15} />
      </ActionIcon>
    </div>
  );
}
