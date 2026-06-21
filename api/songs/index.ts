import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../lib/mongodb.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const collection = db.collection("songs");

  if (req.method === "GET") {
    const songs = await collection.find({}).toArray();
    return res.status(200).json(songs);
  }

  if (req.method === "POST") {
    const data = req.body;
    const result = await collection.insertOne({
      ...data,
      accessCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, ...data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
