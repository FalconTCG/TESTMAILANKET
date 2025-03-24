/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: {
      '/dashboard/**': true
    }
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  output: 'standalone',
  // Explicitly disable static generation for specific paths
  publicRuntimeConfig: {
    skipValidation: ['dashboard', 'dashboard-view']
  },
  // Exclude entire pages from build
  excludePages: ['/dashboard/**'],
};

module.exports = nextConfig; 