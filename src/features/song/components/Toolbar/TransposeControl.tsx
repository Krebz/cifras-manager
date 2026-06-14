import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import type { CSSProperties } from "react";

type Props = {
  transpose: number;
  currentKey: string;
  isDark: boolean;
  groupStyle: CSSProperties;
  buttonStyle: CSSProperties;
  onDecrease: () => void;
  onIncrease: () => void;
  onReset: () => void;
};

export default function TransposeControl({
  transpose,
  currentKey,
  isDark,
  groupStyle,
  buttonStyle,
  onDecrease,
  onIncrease,
  onReset,
}: Props) {
  const isTransposed = transpose !== 0;

  return (
    <div style={groupStyle}>
      <Tooltip label="Diminuir tom">
        <ActionIcon size="sm" radius="md" variant="light" style={buttonStyle} onClick={onDecrease}>
          <IconMinus size={13} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label={isTransposed ? "Voltar ao tom original" : "Tom original"} disabled={!isTransposed}>
        <Text
          size="sm"
          fw="bold"
          component={isTransposed ? "button" : "span"}
          onClick={isTransposed ? onReset : undefined}
          style={{
            color: isTransposed ? (isDark ? "#fbbf24" : "#d97706") : (isDark ? "#93c5fd" : "#c4b5fd"),
            whiteSpace: "nowrap",
            cursor: isTransposed ? "pointer" : "default",
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            fontWeight: "bold",
            textDecoration: isTransposed ? "underline dotted" : "none",
          }}
        >
          {currentKey}
          {isTransposed && (
            <span style={{ fontSize: "11px", marginLeft: "3px", opacity: 0.8 }}>
              ({transpose > 0 ? "+" : ""}{transpose})
            </span>
          )}
        </Text>
      </Tooltip>

      <Tooltip label="Aumentar tom">
        <ActionIcon size="sm" radius="md" variant="light" style={buttonStyle} onClick={onIncrease}>
          <IconPlus size={13} />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
