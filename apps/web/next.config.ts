import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ CRITICAL: Enable standalone output for Docker
  output: "standalone",

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  // ❌ REMOVE: telemetry option tidak valid di Next.js 16
  // telemetry: false,  // <-- Hapus baris ini

  // Transpile packages if needed
  transpilePackages: [],

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
