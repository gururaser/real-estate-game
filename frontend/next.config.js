/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/qdrant/:path*',
        destination: (process.env.NEXT_PUBLIC_QDRANT_URL || 'http://qdrant:6333') + '/:path*',
      },
      {
        source: '/api/superlinked/:path*',
        destination: (process.env.NEXT_PUBLIC_SUPERLINKED_URL || 'http://superlinked:8080') + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
