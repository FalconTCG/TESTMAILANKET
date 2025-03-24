/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  // Redirect handling in runtime
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard-view',
        permanent: false,
      },
      {
        source: '/dashboard/:path*',
        destination: '/dashboard-view',
        permanent: false,
      },
    ]
  }
};

module.exports = nextConfig; 