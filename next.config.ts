import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-resizable-panels'],
  experimental: {
    optimizePackageImports: ['react-resizable-panels']
  }
};

export default nextConfig;
