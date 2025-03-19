import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Extend the global object for TypeScript
/* eslint-disable no-var */
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
/* eslint-enable no-var */

// Use a global variable to store the MongoDB client promise
const client = new MongoClient(MONGO_URI);

const clientPromise: Promise<MongoClient> =
  globalThis._mongoClientPromise ?? (globalThis._mongoClientPromise = client.connect());

export async function connectDB() {
  return (await clientPromise).db();
}
