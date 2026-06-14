import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import type { CSSProperties } from "react";

type Props = {
  isScrolling: boolean;
  scrollSpeed: number;
  isDark: boolean;
  groupStyle: CSSProperties;
  buttonStyle: CSSProperties;
  onToggle: () => void;
  onDecreaseSpeed: () => void;
  onIncreaseSpeed: () => void;
};

export default function ScrollControl({
  isScrolling,
  scrollSpeed,
  isDark,
  groupStyle,
  buttonStyle,
  onToggle,
  onDecreaseSpeed,
  onIncreaseSpeed,
}: Props) {
  const speedColor =
    scrollSpeed >= 7
      ? "#f87171"
      : scrollSpeed >= 4
        ? "#facc15"
        : isDark
          ? "#93c5fd"
          : "#c4b5fd";

  return (
    <div style={groupStyle}>
      <Tooltip label={isScrolling ? "Parar rolagem automática" : "Iniciar rolagem automática"}>
        <ActionIcon
          size="sm"
          radius="md"
          color={isScrolling ? "red" : "blue"}
          variant={isScrolling ? "filled" : "light"}
          style={{
            ...(!isScrolling ? buttonStyle : {}),
            boxShadow: isScrolling ? "0 0 10px rgba(255,0,0,0.5)" : "none",
          }}
          onClick={onToggle}
        >
          {isScrolling ? <IconPlayerStop size={13} /> : <IconPlayerPlay size={13} />}
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Diminuir velocidade (seta esquerda)">
        <ActionIcon size="sm" radius="xl" variant="light" style={buttonStyle} onClick={onDecreaseSpeed}>
          <IconChevronLeft size={13} />
        </ActionIcon>
      </Tooltip>

      <Text fw="bold" size="sm" style={{ color: speedColor, minWidth: "14px", textAlign: "center" }}>
        {scrollSpeed}
      </Text>

      <Tooltip label="Aumentar velocidade (seta direita)">
        <ActionIcon size="sm" radius="xl" variant="light" style={buttonStyle} onClick={onIncreaseSpeed}>
          <IconChevronRight size={13} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
