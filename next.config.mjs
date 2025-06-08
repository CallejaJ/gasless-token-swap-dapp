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
    webpackBuildWorker: true,
  },
  webpack: (config, { isServer, dev }) => {
    // Configuración para evitar ChunkLoadError
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        privy: {
          test: /[\\/]node_modules[\\/]@privy-io[\\/]/,
          name: 'privy',
          chunks: 'all',
          priority: 40,
        },
        web3: {
          test: /[\\/]node_modules[\\/](viem|wagmi|@tanstack)[\\/]/,
          name: 'web3',
          chunks: 'all',
          priority: 30,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
      },
      maxSize: 244000, // Aumentamos el tamaño máximo
    };

    // Configuración para Node.js polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Configuración específica para módulos problemáticos
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'encoding': 'commonjs encoding',
      });
    }

    // Configuración para evitar errores de importación dinámica
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

export default nextConfig;