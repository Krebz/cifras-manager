import { Button, Text, Tooltip } from "@mantine/core";
import type { CSSProperties } from "react";

type Props = {
  isScrolling: boolean;
  scrollSpeed: number;
  isDark: boolean;
  groupStyle: CSSProperties;
  onToggle: () => void;
  onDecreaseSpeed: () => void;
  onIncreaseSpeed: () => void;
};

export default function ScrollControl({
  isScrolling,
  scrollSpeed,
  isDark,
  groupStyle,
  onToggle,
  onDecreaseSpeed,
  onIncreaseSpeed,
}: Props) {
  const scrollLabel =
    scrollSpeed >= 7 ? "Rápido" : scrollSpeed >= 4 ? "Médio" : "Lento";
  const scrollStatus = isScrolling ? "Ativo" : "Pausado";

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
        <Button
          size="xs"
          radius="md"
          color={isScrolling ? "red" : "blue"}
          style={{
            fontWeight: "bold",
            boxShadow: isScrolling ? "0 0 12px rgba(255,0,0,0.6)" : "none",
          }}
          onClick={onToggle}
        >
          {isScrolling ? "Parar" : "Scroll"}
        </Button>
      </Tooltip>

      <Text
        fw="bold"
        style={{
          color: isScrolling ? "#4ade80" : "#94a3b8",
          opacity: isScrolling ? 1 : 0.7,
          transition: "all 0.3s ease",
          whiteSpace: "nowrap",
        }}
        size="sm"
      >
        ● {scrollStatus}
      </Text>

      <Tooltip label="Diminuir velocidade (seta esquerda)">
        <Button size="xs" radius="xl" variant="light" onClick={onDecreaseSpeed}>
          ←
        </Button>
      </Tooltip>

      <Text fw="bold" size="sm" style={{ color: speedColor, whiteSpace: "nowrap" }}>
        ⚡ {scrollSpeed} • {scrollLabel}
      </Text>

      <Tooltip label="Aumentar velocidade (seta direita)">
        <Button size="xs" radius="xl" variant="light" onClick={onIncreaseSpeed}>
          →
        </Button>
      </Tooltip>
    </div>
  );
}
