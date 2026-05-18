/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
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
})
