import { MongoClient, type Db } from "mongodb";

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI não definida nas variáveis de ambiente");

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("katando-cifras");
}
