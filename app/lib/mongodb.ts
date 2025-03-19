import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

// Declare a global type to avoid TypeScript errors
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Use a global variable to store the MongoDB client promise
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGO_URI);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectDB() {
  return (await clientPromise).db();
}
