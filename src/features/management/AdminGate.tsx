import { type FormEvent, useState } from "react";
import { Button, PasswordInput, Stack, Text } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS as string | undefined;
const SESSION_KEY = "cifras_admin_auth";

type Props = {
  isDark: boolean;
  children: React.ReactNode;
};

export default function AdminGate({ isDark, children }: Props) {
  const [authed, setAuthed] = useState(
    () => !ADMIN_PASS || sessionStorage.getItem(SESSION_KEY) === "ok",
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "ok");
      setAuthed(true);
    } else {
      setError(true);
      setInput("");
    }
  }

  const bg = isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)";
  const border = isDark ? "1px solid rgba(148,163,184,0.22)" : "1px solid rgba(148,163,184,0.30)";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: bg,
          border,
          borderRadius: 16,
          padding: "32px 28px",
          backdropFilter: "blur(14px)",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.3)"
            : "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <Stack gap="lg">
          <Stack gap={6} align="center">
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.10)",
                border: isDark
                  ? "1px solid rgba(96,165,250,0.25)"
                  : "1px solid rgba(37,99,235,0.18)",
              }}
            >
              <IconLock size={22} color={isDark ? "#60a5fa" : "#2563eb"} />
            </div>
            <Text fw={700} size="lg" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              Área restrita
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Digite a senha para acessar a gestão de cifras.
            </Text>
          </Stack>

          <PasswordInput
            placeholder="Senha"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            error={error ? "Senha incorreta." : undefined}
            autoFocus
          />

          <Button type="submit" fullWidth disabled={!input}>
            Entrar
          </Button>
        </Stack>
      </form>
    </div>
  );
}
