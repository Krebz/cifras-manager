import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local before using env vars (mesmo padrão do seed.ts)
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

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definida. Verifique .env.local");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error("ADMIN_EMAIL não definida. Verifique .env.local");

  const client = new MongoClient(uri);
  await client.connect();
  console.log("Conectado ao MongoDB Atlas");

  const db = client.db("katando-cifras");

  // 1. Localiza o usuário admin (precisa ter logado ao menos uma vez)
  const admin = await db.collection("users").findOne({ email: adminEmail });
  if (!admin) {
    console.error(
      `Usuário admin (${adminEmail}) não encontrado na coleção 'users'.\n` +
      `Faça login em produção com essa conta pelo menos uma vez e rode de novo.`
    );
    await client.close();
    process.exit(1);
  }
  console.log(`Admin encontrado: ${admin.name} (googleId ${admin.googleId})`);

  // 2. Carimba userId nos setlists órfãos (sem userId)
  const setlists = db.collection("setlists");
  const orphans = await setlists.countDocuments({
    userId: { $exists: false },
  });
  console.log(`${orphans} repertório(s) órfão(s) encontrado(s).`);

  if (orphans === 0) {
    console.log("Nada a migrar.");
    await client.close();
    return;
  }

  const result = await setlists.updateMany(
    { userId: { $exists: false } },
    { $set: { userId: admin.googleId, updatedAt: new Date() } }
  );
  console.log(`${result.modifiedCount} repertório(s) associado(s) ao admin.`);

  await client.close();
}

migrate().catch((err) => {
  console.error("Erro na migração:", err.message);
  process.exit(1);
});
