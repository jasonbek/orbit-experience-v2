import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.canada-ici.com',
      },
      // Add more patterns as needed
    ],
  },
};

export default nextConfig;
