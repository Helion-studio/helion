import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // hosts used by most 21st.dev / Aceternity demo components
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.aceternity.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "cdn.magicui.design" },
    ],
  },
};

export default nextConfig;
