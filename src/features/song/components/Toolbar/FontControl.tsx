import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import type { CSSProperties } from "react";

type Props = {
  fontSize: number;
  isDark: boolean;
  groupStyle: CSSProperties;
  buttonStyle: CSSProperties;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function FontControl({
  fontSize,
  isDark,
  groupStyle,
  buttonStyle,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <div style={groupStyle}>
      <Tooltip label="Diminuir fonte">
        <ActionIcon size="sm" radius="xl" variant="light" style={buttonStyle} onClick={onDecrease}>
          <IconMinus size={13} />
        </ActionIcon>
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
        <ActionIcon size="sm" radius="xl" variant="light" style={buttonStyle} onClick={onIncrease}>
          <IconPlus size={13} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
