import { Button, Text, Tooltip } from "@mantine/core";
import type { CSSProperties } from "react";

type Props = {
  transpose: number;
  currentKey: string;
  isDark: boolean;
  groupStyle: CSSProperties;
  buttonStyle: CSSProperties;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function TransposeControl({
  transpose,
  currentKey,
  isDark,
  groupStyle,
  buttonStyle,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <div style={groupStyle}>
      <Tooltip label="Diminuir tom">
        <Button size="xs" radius="md" variant="light" style={buttonStyle} onClick={onDecrease}>
          Tom -
        </Button>
      </Tooltip>

      <Text
        size="sm"
        fw="bold"
        style={{
          color: isDark ? "#93c5fd" : "#c4b5fd",
          whiteSpace: "nowrap",
        }}
      >
        {currentKey}
        {transpose !== 0 && (
          <span
            style={{
              fontSize: "12px",
              marginLeft: "4px",
              opacity: isDark ? 0.7 : 1,
              color: isDark ? "#cbd5e1" : "#94a3b8",
            }}
          >
            ({transpose > 0 ? "+" : ""}
            {transpose})
          </span>
        )}
      </Text>

      <Tooltip label="Aumentar tom">
        <Button size="xs" radius="md" variant="light" style={buttonStyle} onClick={onIncrease}>
          Tom +
        </Button>
      </Tooltip>
    </div>
  );
}
