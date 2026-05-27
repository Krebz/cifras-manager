import { Button, Text, Tooltip } from "@mantine/core";
import type { CSSProperties } from "react";

type Props = {
  fontSize: number;
  isDark: boolean;
  groupStyle: CSSProperties;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function FontControl({
  fontSize,
  isDark,
  groupStyle,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <div style={groupStyle}>
      <Tooltip label="Diminuir fonte">
        <Button size="xs" radius="xl" variant="light" onClick={onDecrease}>
          A-
        </Button>
      </Tooltip>

      <Text
        fw="bold"
        size="sm"
        style={{
          color: isDark ? "#93c5fd" : "#c4b5fd",
          minWidth: "20px",
          textAlign: "center",
        }}
      >
        {fontSize}
      </Text>

      <Tooltip label="Aumentar fonte">
        <Button size="xs" radius="xl" variant="light" onClick={onIncrease}>
          A+
        </Button>
      </Tooltip>
    </div>
  );
}
