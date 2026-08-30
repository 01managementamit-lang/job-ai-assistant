/** @type {import('next').NextConfig} */
const nextConfig = {
  // This tells the app how to handle the "undici" error you saw
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false,
    };
    return config;
  },
};

export default nextConfig;
