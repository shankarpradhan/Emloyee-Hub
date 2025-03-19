import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Extend the global object for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Use a global variable to store the MongoDB client promise
const client = new MongoClient(MONGO_URI);

if (!globalThis._mongoClientPromise) {
  globalThis._mongoClientPromise = client.connect();
}

// Ensure TypeScript knows `_mongoClientPromise` is always defined
const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise!;

export async function connectDB() {
  return (await clientPromise).db();
}
