import { Button, Loader, Stack, Text } from "@mantine/core";
import { IconBrandGoogle, IconLock } from "@tabler/icons-react";
import { useUser } from "../../contexts/UserContext";

type Props = {
  isDark: boolean;
  children: React.ReactNode;
};

export default function AdminGate({ isDark, children }: Props) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Loader size="sm" />
      </Stack>
    );
  }

  if (user?.role === "admin") return <>{children}</>;

  const bg = isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.78)";
  const border = isDark ? "1px solid rgba(148,163,184,0.22)" : "1px solid rgba(148,163,184,0.30)";
  const accentColor = isDark ? "#60a5fa" : "#2563eb";
  const accentBg = isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.10)";
  const accentBorder = isDark ? "1px solid rgba(96,165,250,0.25)" : "1px solid rgba(37,99,235,0.18)";

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 16px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          background: bg,
          border,
          borderRadius: 16,
          padding: "32px 28px",
          backdropFilter: "blur(14px)",
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 24px rgba(15,23,42,0.08)",
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
                background: accentBg,
                border: accentBorder,
              }}
            >
              <IconLock size={22} color={accentColor} />
            </div>
            <Text fw={700} size="lg" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              Área restrita
            </Text>
            {user ? (
              <Text size="sm" c="dimmed" ta="center">
                Sua conta ({user.email}) não tem permissão de administrador.
              </Text>
            ) : (
              <Text size="sm" c="dimmed" ta="center">
                Faça login com sua conta Google para acessar a gestão de cifras.
              </Text>
            )}
          </Stack>

          {!user && (
            <Button
              component="a"
              href="/api/auth/google"
              fullWidth
              leftSection={<IconBrandGoogle size={18} />}
              variant="default"
            >
              Entrar com Google
            </Button>
          )}
        </Stack>
      </div>
    </div>
  );
}
