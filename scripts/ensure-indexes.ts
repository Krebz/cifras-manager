import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";
import dns from "dns";
// c-ares do Node recusa a query SRV do Atlas em algumas redes — força DNS público
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const envPath = resolve(process.cwd(), ".env.local");
try {
  const content = readFileSync(envPath, "utf-8");
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

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definida. Verifique .env.local");

  const client = new MongoClient(uri);
  await client.connect();
  console.log("Conectado ao MongoDB Atlas");
  const db = client.db("katando-cifras");

  // users: googleId é a chave de identidade (único, previne duplicar usuário);
  // email é consultado no login (admin) e na migração
  await db.collection("users").createIndex({ googleId: 1 }, { unique: true, name: "googleId_unique" });
  await db.collection("users").createIndex({ email: 1 }, { name: "email" });
  console.log("users: googleId (único) + email");

  // setlists: a listagem filtra por dono
  await db.collection("setlists").createIndex({ userId: 1 }, { name: "userId" });
  console.log("setlists: userId");

  // songs: cifras migradas do seed são buscadas por legacyId (sparse — só as que têm)
  await db.collection("songs").createIndex({ legacyId: 1 }, { sparse: true, name: "legacyId" });
  console.log("songs: legacyId (sparse)");

  console.log("\nÍndices garantidos.");
  await client.close();
}

main().catch((e) => { console.error("Erro:", e.message); process.exit(1); });
