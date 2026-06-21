import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local before using env vars
const envPath = resolve(process.cwd(), ".env.local");
try {
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // rely on existing env vars if .env.local not found
}

import { songs } from "../src/data/songs";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definida. Verifique .env.local");

  const client = new MongoClient(uri);
  await client.connect();
  console.log("Conectado ao MongoDB Atlas");

  const db = client.db("katando-cifras");
  const collection = db.collection("songs");

  const count = await collection.countDocuments();
  if (count > 0) {
    console.log(`Collection já tem ${count} documento(s). Nada inserido.`);
    await client.close();
    return;
  }

  const docs = songs.map(({ id, accessCount, ...rest }) => ({
    ...rest,
    legacyId: id,
    accessCount: accessCount ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const result = await collection.insertMany(docs);
  console.log(`${result.insertedCount} cifras inseridas no Atlas!`);

  await client.close();
}

seed().catch((err) => {
  console.error("Erro no seed:", err.message);
  process.exit(1);
});
