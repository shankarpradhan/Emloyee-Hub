import { MongoClient, Db } from "mongodb";

// Retrieve MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

const client = new MongoClient(MONGO_URI);

// Use a global variable to store the MongoDB client promise
const clientPromise: Promise<MongoClient> =
  globalThis._mongoClientPromise ?? (globalThis._mongoClientPromise = client.connect());

/**
 * Connect to MongoDB and return the database instance.
 * @returns {Promise<Db>} MongoDB database instance.
 */
export async function connectDB(): Promise<Db> {
  const client = await clientPromise;
  return client.db(); // Return the database instance
}
