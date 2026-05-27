import { ActionIcon, Tooltip } from "@mantine/core";
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
  onToggleUltraCompact,
}: Props) {
  const styles = appStyles(isDark, ultraCompact);
  const group = styles.toolbarGroup;
  const button = styles.toolbarButton;
  const iconButton = styles.toolbarIconButton;

  return (
    <div style={styles.toolbar}>
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
