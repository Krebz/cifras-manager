import { ActionIcon, Tooltip } from "@mantine/core";
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
  onTransposeDecrease: () => void;
  onTransposeIncrease: () => void;
  onScrollToggle: () => void;
  onScrollSpeedDecrease: () => void;
  onScrollSpeedIncrease: () => void;
  onFontDecrease: () => void;
  onFontIncrease: () => void;
  onToggleUltraCompact: () => void;
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
  onTransposeDecrease,
  onTransposeIncrease,
  onScrollToggle,
  onScrollSpeedDecrease,
  onScrollSpeedIncrease,
  onFontDecrease,
  onFontIncrease,
  onToggleUltraCompact,
}: Props) {
  const group = toolbarStyles.toolbarGroup;
  const button = toolbarStyles.toolbarButton;
  const iconButton = toolbarStyles.toolbarIconButton;

  return (
    <div style={toolbarStyles.toolbar}>
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
