"use client";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  interface Window {
    _mongoClientPromise: Promise<MongoClient> | undefined;
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
export {};
// Your component code...