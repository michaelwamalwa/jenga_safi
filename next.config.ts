import type { NextConfig } from "next";

const nextConfig: NextConfig = {
typeScript: {
  ignoreBuildErrors: true,
},
productionBrowserSourceMaps: true,
};

export default nextConfig;
