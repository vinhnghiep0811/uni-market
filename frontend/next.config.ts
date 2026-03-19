import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/dist/**",
          "**/build/**",
          "**/coverage/**",
          "**/.turbo/**",
        ],
      };
    }
    return config;
  },
  output: 'standalone',
};

export default nextConfig;
