import type { NextConfig } from "next";
require("dotenv").config();
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;

