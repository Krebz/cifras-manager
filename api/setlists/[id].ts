import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";

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

  if (req.method === "GET") {
    const setlist = await collection.findOne(filter);
    if (!setlist) return res.status(404).json({ error: "Repertório não encontrado" });
    return res.status(200).json(setlist);
  }

  if (req.method === "PUT") {
    const { _id, legacyId, ...data } = req.body;
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
