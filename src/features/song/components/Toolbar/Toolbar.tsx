import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconArrowLeft, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { CSSProperties } from "react";
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
  ultraCompact: boolean;
  toolbarStyles: ToolbarStyles;
  setlistId?: string;
  setlistName?: string;
  prevSongId?: string;
  nextSongId?: string;
  onTransposeDecrease: () => void;
  onTransposeIncrease: () => void;
  onScrollToggle: () => void;
  onScrollSpeedDecrease: () => void;
  onScrollSpeedIncrease: () => void;
  onFontDecrease: () => void;
  onFontIncrease: () => void;
  onToggleUltraCompact: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onNavigateSetlist?: () => void;
};

export default function Toolbar({
  transpose,
  currentKey,
  isScrolling,
  scrollSpeed,
  fontSize,
  isDark,
  ultraCompact,
  toolbarStyles,
  setlistName,
  prevSongId,
  nextSongId,
  onTransposeDecrease,
  onTransposeIncrease,
  onScrollToggle,
  onScrollSpeedDecrease,
  onScrollSpeedIncrease,
  onFontDecrease,
  onFontIncrease,
  onToggleUltraCompact,
  onNavigatePrev,
  onNavigateNext,
  onNavigateSetlist,
}: Props) {
  const group = toolbarStyles.toolbarGroup;
  const button = toolbarStyles.toolbarButton;
  const iconButton = toolbarStyles.toolbarIconButton;

  return (
    <div style={toolbarStyles.toolbar}>
      {onNavigateSetlist && (
        <div style={{ ...group, gap: 4 }}>
          <Tooltip label="Voltar ao repertório">
            <ActionIcon size="sm" variant="subtle" style={iconButton} onClick={onNavigateSetlist}>
              <IconArrowLeft size={15} />
            </ActionIcon>
          </Tooltip>
          {setlistName && !ultraCompact && (
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

      <TransposeControl
        transpose={transpose}
        currentKey={currentKey}
        isDark={isDark}
        groupStyle={group}
        buttonStyle={button}
        onDecrease={onTransposeDecrease}
        onIncrease={onTransposeIncrease}
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

      <div style={group}>
        <Tooltip
          label={
            ultraCompact
              ? "Desativar modo ultra compacto"
              : "Ativar modo ultra compacto"
          }
        >
          <ActionIcon
            size="sm"
            radius="md"
            variant={ultraCompact ? "filled" : "light"}
            color={ultraCompact ? "grape" : "gray"}
            style={ultraCompact ? undefined : iconButton}
            onClick={onToggleUltraCompact}
          >
            UC
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
}
