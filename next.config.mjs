/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize for development experience
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable aggressive code splitting in development
      config.optimization.splitChunks = {
        chunks: "async",
        cacheGroups: {
          default: false,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
