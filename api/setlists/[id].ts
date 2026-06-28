import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";
import { requireUser } from "../lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== "string" || !id) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const db = await getDb();
  const collection = db.collection("setlists");

  const filter = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { legacyId: id };

  // GET público — qualquer um com o link pode ver o repertório
  if (req.method === "GET") {
    const setlist = await collection.findOne(filter);
    if (!setlist) return res.status(404).json({ error: "Repertório não encontrado" });
    return res.status(200).json(setlist);
  }

  // Mutações exigem login e propriedade
  const user = requireUser(req, res);
  if (!user) return;

  const setlist = await collection.findOne(filter);
  if (!setlist) return res.status(404).json({ error: "Repertório não encontrado" });

  if (setlist.userId && setlist.userId !== user.sub && user.role !== "admin") {
    return res.status(403).json({ error: "Sem permissão" });
  }

  if (req.method === "PUT") {
    const { _id, legacyId, userId, ...data } = req.body;
    await collection.updateOne(
      filter,
      { $set: { ...data, updatedAt: new Date() } }
    );
    const updated = await collection.findOne(filter);
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await collection.deleteOne(filter);
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
