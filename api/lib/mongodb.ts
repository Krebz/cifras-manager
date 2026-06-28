import { MongoClient, type Db } from "mongodb";

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definida nas variáveis de ambiente");

  if (!client) {
    // maxPoolSize baixo: cada instância serverless da Vercel abre seu próprio
    // pool; o M0 do Atlas permite no máximo 500 conexões. Limitar evita
    // estourar esse teto em picos de concorrência.
    client = new MongoClient(uri, { maxPoolSize: 10 });
    await client.connect();
  }
  return client.db("katando-cifras");
}
