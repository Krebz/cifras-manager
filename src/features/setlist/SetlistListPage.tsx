import { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconCalendar, IconMusic, IconPlaylist, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  createSetlist,
  deleteSetlist,
  getSetlists,
} from "../../services/setlistRepository";
import { navigate } from "../../app/router";
import { routes } from "../../app/routes";
import type { Setlist } from "../../types/setlist";

type Props = { isDark: boolean };

export default function SetlistListPage({ isDark }: Props) {
  const [setlists, setSetlists] = useState<Setlist[]>(getSetlists);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Setlist | null>(null);

  const cardBg = isDark ? "rgba(30,41,59,0.8)" : "#fff";
  const cardBorder = isDark ? "1px solid rgba(148,163,184,0.2)" : "1px solid #e2e8f0";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  function handleCreate() {
    if (!newName.trim()) return;
    createSetlist(newName.trim(), newDate || undefined);
    setSetlists(getSetlists());
    setNewName("");
    setNewDate("");
    setCreateOpen(false);
  }

  function handleDelete(setlist: Setlist) {
    deleteSetlist(setlist.id);
    setSetlists(getSetlists());
    setDeleteTarget(null);
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 20 }}>
          Repertórios
        </Title>
        <Button
          leftSection={<IconPlus size={16} />}
          size="sm"
          onClick={() => setCreateOpen(true)}
        >
          Novo repertório
        </Button>
      </Group>

      {setlists.length === 0 && (
        <Stack align="center" gap="xs" py="xl">
          <IconPlaylist size={40} color={textMuted} />
          <Text c="dimmed" size="sm">Nenhum repertório criado ainda.</Text>
          <Text c="dimmed" size="xs">Crie um repertório para organizar suas músicas por missa ou ensaio.</Text>
        </Stack>
      )}

      {setlists.map((setlist) => (
        <div
          key={setlist.id}
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: 10,
            padding: "14px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)",
          }}
          onClick={() => navigate(routes.setlist(setlist.id))}
        >
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} style={{ color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 15 }}>
              {setlist.name}
            </Text>
            <Group gap="xs">
              {setlist.date && (
                <Group gap={4}>
                  <IconCalendar size={13} color={textMuted} />
                  <Text size="xs" c="dimmed">
                    {new Date(setlist.date + "T00:00:00").toLocaleDateString("pt-BR")}
                  </Text>
                </Group>
              )}
              <Group gap={4}>
                <IconMusic size={13} color={textMuted} />
                <Text size="xs" c="dimmed">
                  {setlist.songIds.length} {setlist.songIds.length === 1 ? "música" : "músicas"}
                </Text>
              </Group>
            </Group>
          </Stack>

          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(setlist);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      ))}

      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo repertório"
        size="sm"
      >
        <Stack gap="sm">
          <TextInput
            label="Nome"
            placeholder="Ex: Missa Domingo 10h"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
            required
          />
          <TextInput
            label="Data (opcional)"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="xs">
            <Button variant="subtle" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Criar</Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir repertório"
        size="sm"
      >
        <Stack gap="sm">
          <Text size="sm">
            Tem certeza que deseja excluir o repertório <strong>{deleteTarget?.name}</strong>?
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button color="red" onClick={() => deleteTarget && handleDelete(deleteTarget)}>
              Excluir
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
