import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN access (e.g. testing from a phone), dev only.
  allowedDevOrigins: ["192.168.0.67"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
