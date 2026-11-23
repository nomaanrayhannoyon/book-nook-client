import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },
  images: {
    // Book covers are free-form URLs pasted by users, so the app must be
    // able to optimize images from any host — a fixed allowlist crashes the
    // page (next/image throws) the moment a new domain appears. Wildcard `**`
    // matches every hostname; restrict to the two protocols the form accepts.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
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
