/**
 * Total de usuários cadastrados. O endpoint exige sessão de admin, então só
 * faz sentido chamar de dentro da Gestão (que já vive atrás do AdminGate).
 */
export async function fetchUserCount(): Promise<number> {
  const response = await fetch("/api/users/count", { credentials: "include" });
  if (!response.ok) throw new Error("Falha ao contar usuários");
  const { total } = (await response.json()) as { total: number };
  return total;
}
