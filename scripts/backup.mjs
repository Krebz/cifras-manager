import { MongoClient } from "mongodb";
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import dns from "dns";

// c-ares do Node recusa a query SRV do Atlas em algumas redes — força DNS público.
// No GitHub Actions é inofensivo; localmente faz o mongodb+srv:// funcionar.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Carrega .env.local em execução local (no CI as vars vêm do ambiente).
try {
  const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[k]) process.env[k] = v;
  }
} catch {
  // usa env já existentes
}

const COLLECTIONS = ["songs", "setlists", "users"];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definida");

  const outDir = resolve(process.cwd(), process.env.BACKUP_DIR ?? "backup");
  mkdirSync(outDir, { recursive: true });

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("katando-cifras");

  for (const name of COLLECTIONS) {
    const docs = await db.collection(name).find({}).toArray();
    writeFileSync(resolve(outDir, `${name}.json`), JSON.stringify(docs, null, 2));
    console.log(`${name}: ${docs.length} documento(s)`);
  }

  await client.close();
  console.log(`Backup salvo em ${outDir}`);
}

main().catch((e) => { console.error("Erro no backup:", e.message); process.exit(1); });
