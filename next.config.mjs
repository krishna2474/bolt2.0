/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: { domains: ["lh3.googleusercontent.com"] },
};

export default nextConfig;
