import { ActionIcon, Divider, Group, Popover, ScrollArea, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconKeyboard,
  IconMaximize,
  IconMinimize,
  IconPlaylistAdd,
  IconPlus,
  IconShare,
} from "@tabler/icons-react";
import { forwardRef, useState, type CSSProperties } from "react";
import { addSongToSetlist, createSetlist, getSetlists } from "../../../../services/setlistRepository";
import FontControl from "./FontControl";
import ScrollControl from "./ScrollControl";
import TransposeControl from "./TransposeControl";

type ToolbarStyles = {
  toolbar: CSSProperties;
  toolbarGroup: CSSProperties;
  toolbarButton: CSSProperties;
  toolbarIconButton: CSSProperties;
};

type Props = {
  transpose: number;
  currentKey: string;
  capo?: number;
  capoActive?: boolean;
  isScrolling: boolean;
  scrollSpeed: number;
  fontSize: number;
  isDark: boolean;
  toolbarStyles: ToolbarStyles;
  songId: string;
  setlistId?: string;
  setlistName?: string;
  prevSongId?: string;
  nextSongId?: string;
  isFullscreen?: boolean;
  onTransposeDecrease: () => void;
  onTransposeIncrease: () => void;
  onTransposeReset: () => void;
  onCapoToggle?: () => void;
  onScrollToggle: () => void;
  onScrollSpeedDecrease: () => void;
  onScrollSpeedIncrease: () => void;
  onFontDecrease: () => void;
  onFontIncrease: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onNavigateSetlist?: () => void;
  onNavigateBack?: () => void;
  onToggleFullscreen?: () => void;
};

const Toolbar = forwardRef<HTMLDivElement, Props>(function Toolbar({
  transpose,
  currentKey,
  capo,
  capoActive,
  isScrolling,
  scrollSpeed,
  fontSize,
  isDark,
  toolbarStyles,
  songId,
  setlistName,
  prevSongId,
  nextSongId,
  isFullscreen,
  onTransposeDecrease,
  onTransposeIncrease,
  onTransposeReset,
  onCapoToggle,
  onScrollToggle,
  onScrollSpeedDecrease,
  onScrollSpeedIncrease,
  onFontDecrease,
  onFontIncrease,
  onNavigatePrev,
  onNavigateNext,
  onNavigateSetlist,
  onNavigateBack,
  onToggleFullscreen,
}: Props, ref) {
  const group = toolbarStyles.toolbarGroup;
  const button = toolbarStyles.toolbarButton;
  const iconButton = toolbarStyles.toolbarIconButton;
  const [copied, setCopied] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleAddToSetlist(setlistId: string) {
    await addSongToSetlist(setlistId, songId);
    setAddedTo(setlistId);
    setTimeout(() => { setAddedTo(null); setPlaylistOpen(false); }, 1200);
  }

  async function handleCreateAndAdd() {
    const name = newName.trim();
    if (!name) return;
    const sl = await createSetlist(name);
    await addSongToSetlist(sl.id, songId);
    setNewName("");
    setCreatingNew(false);
    setAddedTo(sl.id);
    setTimeout(() => { setAddedTo(null); setPlaylistOpen(false); }, 1200);
  }

  const kbdStyle: CSSProperties = {
    padding: "2px 7px",
    borderRadius: 4,
    border: "1px solid rgba(148,163,184,0.3)",
    background: isDark ? "rgba(30,41,59,0.8)" : "rgba(241,245,249,0.9)",
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: 700,
    minWidth: 28,
    textAlign: "center",
    display: "inline-block",
  };

  return (
    <div ref={ref} style={toolbarStyles.toolbar}>
      {/* Navegação de repertório (quando aberto via setlist) */}
      {onNavigateSetlist && (
        <div style={{ ...group, gap: 4 }}>
          <Tooltip label="Voltar ao repertório">
            <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={onNavigateSetlist}>
              <IconArrowLeft size={15} />
            </ActionIcon>
          </Tooltip>
          {setlistName && (
            <Text size="xs" style={{ color: isDark ? "#94a3b8" : "#64748b", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {setlistName}
            </Text>
          )}
          <Tooltip label={prevSongId ? "Música anterior" : "Primeira música"}>
            <ActionIcon size="sm" variant="subtle" style={iconButton} disabled={!prevSongId} onClick={onNavigatePrev}>
              <IconChevronLeft size={15} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={nextSongId ? "Próxima música" : "Última música"}>
            <ActionIcon size="sm" variant="subtle" style={iconButton} disabled={!nextSongId} onClick={onNavigateNext}>
              <IconChevronRight size={15} />
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      {/* Voltar ao catálogo (quando NÃO está em repertório) */}
      {!onNavigateSetlist && onNavigateBack && (
        <div style={{ ...group, gap: 4 }}>
          <Tooltip label="Voltar ao catálogo">
            <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={onNavigateBack}>
              <IconArrowLeft size={15} />
            </ActionIcon>
          </Tooltip>
        </div>
      )}

      <TransposeControl
        transpose={transpose}
        currentKey={currentKey}
        isDark={isDark}
        groupStyle={group}
        buttonStyle={button}
        onDecrease={onTransposeDecrease}
        onIncrease={onTransposeIncrease}
        onReset={onTransposeReset}
      />

      {capo ? (
        <Tooltip label={capoActive ? "Ver acordes no tom real (sem capo)" : "Ver shape com Capo " + capo}>
          <button
            type="button"
            onClick={onCapoToggle}
            style={{
              ...button,
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              border: capoActive
                ? "1px solid rgba(16,185,129,0.5)"
                : "1px dashed rgba(148,163,184,0.4)",
              background: capoActive
                ? isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.12)"
                : "transparent",
              color: capoActive
                ? isDark ? "#6ee7b7" : "#065f46"
                : isDark ? "#64748b" : "#94a3b8",
              textDecoration: capoActive ? "none" : "line-through",
              cursor: "pointer",
            }}
          >
            Capo {capo}
          </button>
        </Tooltip>
      ) : null}

      <ScrollControl
        isScrolling={isScrolling}
        scrollSpeed={scrollSpeed}
        isDark={isDark}
        groupStyle={group}
        buttonStyle={button}
        onToggle={onScrollToggle}
        onDecreaseSpeed={onScrollSpeedDecrease}
        onIncreaseSpeed={onScrollSpeedIncrease}
      />

      <FontControl
        fontSize={fontSize}
        isDark={isDark}
        groupStyle={group}
        buttonStyle={button}
        onDecrease={onFontDecrease}
        onIncrease={onFontIncrease}
      />

      {/* Utilidades: compartilhar, repertório, atalhos, tela cheia */}
      <div style={{ ...group, gap: 4 }}>
        <Tooltip label={copied ? "Copiado!" : "Compartilhar link"}>
          <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={handleShare}>
            {copied ? <IconCheck size={15} /> : <IconShare size={15} />}
          </ActionIcon>
        </Tooltip>

        {/* Adicionar ao repertório */}
        <Popover
          opened={playlistOpen}
          onChange={(o) => { setPlaylistOpen(o); if (!o) { setCreatingNew(false); setNewName(""); } }}
          position="bottom-end"
          withArrow
          shadow="md"
          width={240}
        >
          <Popover.Target>
            <Tooltip label="Adicionar ao repertório">
              <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={() => setPlaylistOpen((o) => !o)}>
                <IconPlaylistAdd size={15} />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown p={10}>
            {(() => {
              const setlists = getSetlists();
              return (
                <Stack gap={6}>
                  <Text size="xs" fw={700} style={{ letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.6 }}>
                    Repertórios
                  </Text>
                  {setlists.length === 0 && (
                    <Text size="xs" c="dimmed">Nenhum repertório criado ainda.</Text>
                  )}
                  <ScrollArea.Autosize mah={180}>
                    <Stack gap={4}>
                      {setlists.map((sl) => (
                        <Group key={sl.id} justify="space-between" gap={6} style={{ padding: "4px 2px" }}>
                          <Text size="xs" style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {sl.name}
                          </Text>
                          <ActionIcon
                            size="xs"
                            variant={addedTo === sl.id ? "filled" : "subtle"}
                            color={addedTo === sl.id ? "green" : undefined}
                            onClick={() => handleAddToSetlist(sl.id)}
                            disabled={sl.songIds.includes(songId)}
                            title={sl.songIds.includes(songId) ? "Já adicionada" : "Adicionar"}
                          >
                            {addedTo === sl.id ? <IconCheck size={12} /> : <IconPlus size={12} />}
                          </ActionIcon>
                        </Group>
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>
                  <Divider />
                  {creatingNew ? (
                    <Stack gap={4}>
                      <TextInput
                        size="xs"
                        placeholder="Nome do novo repertório"
                        value={newName}
                        onChange={(e) => setNewName(e.currentTarget.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleCreateAndAdd(); if (e.key === "Escape") { setCreatingNew(false); setNewName(""); } }}
                        autoFocus
                      />
                      <Group gap={4}>
                        <ActionIcon size="xs" variant="filled" color="blue" disabled={!newName.trim()} onClick={handleCreateAndAdd}>
                          <IconCheck size={12} />
                        </ActionIcon>
                        <Text size="xs" c="dimmed" style={{ cursor: "pointer" }} onClick={() => { setCreatingNew(false); setNewName(""); }}>
                          cancelar
                        </Text>
                      </Group>
                    </Stack>
                  ) : (
                    <Group gap={4} style={{ cursor: "pointer" }} onClick={() => setCreatingNew(true)}>
                      <IconPlus size={13} style={{ opacity: 0.6 }} />
                      <Text size="xs" c="dimmed">Criar novo repertório</Text>
                    </Group>
                  )}
                </Stack>
              );
            })()}
          </Popover.Dropdown>
        </Popover>

        <Popover
          opened={shortcutsOpen}
          onChange={setShortcutsOpen}
          position="bottom-end"
          withArrow
          shadow="md"
          width={230}
        >
          <Popover.Target>
            <ActionIcon
              size="sm"
              variant="subtle"
              style={iconButton}
              title="Atalhos de teclado"
              onClick={() => setShortcutsOpen((o) => !o)}
            >
              <IconKeyboard size={15} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap={8}>
              <Text size="xs" fw={700} style={{ letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.6 }}>
                Atalhos
              </Text>
              {([
                ["Espaço", "Iniciar / Parar rolagem"],
                ["←", "Diminuir velocidade"],
                ["→", "Aumentar velocidade"],
              ] as const).map(([key, desc]) => (
                <Group key={key} gap={8} align="center">
                  <kbd style={kbdStyle}>{key}</kbd>
                  <Text size="xs">{desc}</Text>
                </Group>
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>

        {onToggleFullscreen && (
          <Tooltip label={isFullscreen ? "Sair de tela cheia" : "Tela cheia"}>
            <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={onToggleFullscreen}>
              {isFullscreen ? <IconMinimize size={15} /> : <IconMaximize size={15} />}
            </ActionIcon>
          </Tooltip>
        )}
      </div>
    </div>
  );
});

export default Toolbar;
