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
  experimental: {
    staticWorkerRequestTimeout: 60000,
    webpackBuildWorker: true,
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      ...config.optimization.splitChunks,
      maxSize: 200000,
    };
    return config;
  },
};

export default nextConfig;