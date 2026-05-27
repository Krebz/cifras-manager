import { ActionIcon, Tooltip } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import FontControl from "./FontControl";
import ScrollControl from "./ScrollControl";
import TransposeControl from "./TransposeControl";
import { appStyles } from "../../styles/appStyles";

type Props = {
  transpose: number;
  currentKey: string;
  isScrolling: boolean;
  scrollSpeed: number;
  fontSize: number;
  isDark: boolean;
  ultraCompact: boolean;
  onTransposeDecrease: () => void;
  onTransposeIncrease: () => void;
  onScrollToggle: () => void;
  onScrollSpeedDecrease: () => void;
  onScrollSpeedIncrease: () => void;
  onFontDecrease: () => void;
  onFontIncrease: () => void;
  onToggleTheme: () => void;
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
  onTransposeDecrease,
  onTransposeIncrease,
  onScrollToggle,
  onScrollSpeedDecrease,
  onScrollSpeedIncrease,
  onFontDecrease,
  onFontIncrease,
  onToggleTheme,
  onToggleUltraCompact,
}: Props) {
  const styles = appStyles(isDark, ultraCompact);
  const group = styles.toolbarGroup;

  return (
    <div style={styles.toolbar}>
      <TransposeControl
        transpose={transpose}
        currentKey={currentKey}
        isDark={isDark}
        groupStyle={group}
        onDecrease={onTransposeDecrease}
        onIncrease={onTransposeIncrease}
      />

      <ScrollControl
        isScrolling={isScrolling}
        scrollSpeed={scrollSpeed}
        isDark={isDark}
        groupStyle={group}
        onToggle={onScrollToggle}
        onDecreaseSpeed={onScrollSpeedDecrease}
        onIncreaseSpeed={onScrollSpeedIncrease}
      />

      <FontControl
        fontSize={fontSize}
        isDark={isDark}
        groupStyle={group}
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
            onClick={onToggleUltraCompact}
          >
            UC
          </ActionIcon>
        </Tooltip>
      </div>

      <div style={group}>
        <Tooltip label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}>
          <ActionIcon
            size="sm"
            radius="md"
            variant="light"
            color={isDark ? "yellow" : "blue"}
            onClick={onToggleTheme}
          >
            {isDark ? (
              <IconSun size={18} stroke={2} />
            ) : (
              <IconMoon size={18} />
            )}
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
}
