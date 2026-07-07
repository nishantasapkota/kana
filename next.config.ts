import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ["@prisma/client", "@prisma/engines"],
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;