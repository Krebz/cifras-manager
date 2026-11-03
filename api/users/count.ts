import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../lib/mongodb.js";
import { requireAdmin } from "../lib/auth.js";

// Só o total — nenhum dado pessoal sai daqui (LGPD: coleta/exposição mínima).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!requireAdmin(req, res)) return;

  const db = await getDb();
  const total = await db.collection("users").countDocuments();

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ total });
}
