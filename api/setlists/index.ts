import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../lib/mongodb.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const collection = db.collection("setlists");

  if (req.method === "GET") {
    const setlists = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(setlists);
  }

  if (req.method === "POST") {
    const { name, date, songIds } = req.body;
    const result = await collection.insertOne({
      name,
      date: date ?? null,
      songIds: songIds ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const created = await collection.findOne({ _id: result.insertedId });
    return res.status(201).json(created);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
