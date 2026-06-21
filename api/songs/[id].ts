import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongodb.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const db = await getDb();
  const collection = db.collection("songs");
  const objectId = new ObjectId(id);

  if (req.method === "GET") {
    const song = await collection.findOne({ _id: objectId });
    if (!song) return res.status(404).json({ error: "Cifra não encontrada" });
    return res.status(200).json(song);
  }

  if (req.method === "PUT") {
    const { _id, ...data } = req.body;
    await collection.updateOne(
      { _id: objectId },
      { $set: { ...data, updatedAt: new Date() } }
    );
    const updated = await collection.findOne({ _id: objectId });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await collection.deleteOne({ _id: objectId });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Method not allowed" });
}
