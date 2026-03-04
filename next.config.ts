import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",  // covers all Convex deployment subdomains
      },
      {
        protocol: "https",
        hostname: "**.convex.site",
      },
    ],
  },
};

export default nextConfig;

