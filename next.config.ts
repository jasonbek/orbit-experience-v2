import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Localization Optimization: All assets are now served from /public
  images: {
    // remotePatterns removed as per Phase 6 & 7 localized asset directive
  },
};

export default nextConfig;
