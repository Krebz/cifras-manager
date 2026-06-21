import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./lib/mongodb.js";
import { songs } from "../src/data/songs.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const key = req.query.key;
  if (!key || key !== process.env.SEED_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = await getDb();
  const collection = db.collection("songs");

  const count = await collection.countDocuments();
  if (count > 0) {
    return res.status(200).json({ message: `Já existem ${count} cifras. Seed ignorado.` });
  }

  const docs = songs.map(({ id, accessCount, ...rest }) => ({
    ...rest,
    legacyId: id,
    accessCount: accessCount ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await collection.insertMany(docs);
  return res.status(201).json({ inserted: result.insertedCount });
}
