import { ActionIcon, Group, Popover, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconKeyboard,
  IconMaximize,
  IconMinimize,
  IconShare,
} from "@tabler/icons-react";
import { forwardRef, useState, type CSSProperties } from "react";
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
  isScrolling: boolean;
  scrollSpeed: number;
  fontSize: number;
  isDark: boolean;
  toolbarStyles: ToolbarStyles;
  setlistId?: string;
  setlistName?: string;
  prevSongId?: string;
  nextSongId?: string;
  isFullscreen?: boolean;
  onTransposeDecrease: () => void;
  onTransposeIncrease: () => void;
  onTransposeReset: () => void;
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
  isScrolling,
  scrollSpeed,
  fontSize,
  isDark,
  toolbarStyles,
  setlistName,
  prevSongId,
  nextSongId,
  isFullscreen,
  onTransposeDecrease,
  onTransposeIncrease,
  onTransposeReset,
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

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      {/* Utilidades: compartilhar, tela cheia, atalhos */}
      <div style={{ ...group, gap: 4 }}>
        <Tooltip label={copied ? "Copiado!" : "Compartilhar link"}>
          <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={handleShare}>
            {copied ? <IconCheck size={15} /> : <IconShare size={15} />}
          </ActionIcon>
        </Tooltip>

        {onToggleFullscreen && (
          <Tooltip label={isFullscreen ? "Sair de tela cheia" : "Tela cheia"}>
            <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={onToggleFullscreen}>
              {isFullscreen ? <IconMinimize size={15} /> : <IconMaximize size={15} />}
            </ActionIcon>
          </Tooltip>
        )}

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
      </div>
    </div>
  );
});

export default Toolbar;
