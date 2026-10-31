import dns from "node:dns/promises";
import { MongoClient } from "mongodb";

// Some ISPs block SRV lookups for mongodb+srv:// links, so use Google DNS on localhost
if (process.env.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const globalForMongo = globalThis;
if (!globalForMongo._mongoClient) {
  globalForMongo._mongoClient = new MongoClient(process.env.MONGODB_URI);
}

export const client = globalForMongo._mongoClient;
export const db = client.db("studiospace");