import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the sandboxed live-preview host to talk to the dev server (HMR, RSC).
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai"],
};

export default nextConfig;
