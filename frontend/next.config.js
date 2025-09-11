/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/qdrant/:path*',
        destination: 'http://qdrant:6333/:path*',
      },
      {
        source: '/api/superlinked/:path*',
        destination: 'http://superlinked:8080/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
