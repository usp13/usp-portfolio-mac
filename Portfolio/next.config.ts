import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.mzstatic.com" },
      { protocol: "https", hostname: "**.scdn.co" },
      { protocol: "https", hostname: "**.spotifycdn.com" },
      { protocol: "https", hostname: "**.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
