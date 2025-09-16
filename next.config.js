/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    // Suppress false positive warnings about component casing
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ignore type errors during builds if needed
    ignoreBuildErrors: false,
  },
  // Optimize webpack configuration for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size and reduce serialization warnings
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Reduce webpack cache serialization warnings
    config.infrastructureLogging = {
      level: 'error',
    };

    return config;
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Disable source maps in production to reduce bundle size
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;