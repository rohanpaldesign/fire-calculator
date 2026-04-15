import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/fire-calculator",
  images: { unoptimized: true },
};

export default nextConfig;
