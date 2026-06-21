import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";
import { requireAuth } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== "string" || !id) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const db = await getDb();
  const collection = db.collection("songs");

  // Suporte a ObjectId (novas cifras) e UUID legado (cifras migradas)
  const filter = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { legacyId: id };

  if (req.method === "GET") {
    const song = await collection.findOne(filter);
    if (!song) return res.status(404).json({ error: "Cifra não encontrada" });
    return res.status(200).json(song);
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    const { _id, legacyId, ...data } = req.body;
    const $set: Record<string, unknown> = { updatedAt: new Date() };
    const $unset: Record<string, ""> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === "") {
        $unset[k] = "";
      } else {
        $set[k] = v;
      }
    }
    const updateOp: Record<string, unknown> = { $set };
    if (Object.keys($unset).length > 0) updateOp.$unset = $unset;
    await collection.updateOne(filter, updateOp);
    const updated = await collection.findOne(filter);
    return res.status(200).json(updated);
  }

  if (req.method === "PATCH") {
    await collection.updateOne(filter, { $inc: { accessCount: 1 } });
    return res.status(204).end();
  }

  if (req.method === "DELETE") {
    if (!requireAuth(req, res)) return;
    await collection.deleteOne(filter);
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
