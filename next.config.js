/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/mp3/:path*',
        headers: [
          { key: 'Content-Type', value: 'audio/mpeg' },
          { key: 'Accept-Ranges', value: 'bytes' },
        ],
      },
      {
        source: '/pdf/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/pdf' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
