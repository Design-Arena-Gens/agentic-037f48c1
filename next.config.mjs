/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost',
        'agentic-037f48c1.vercel.app'
      ],
    },
  },
};

export default nextConfig;
