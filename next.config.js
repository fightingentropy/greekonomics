/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com'
      },
      {
        protocol: 'https',
        hostname: 'images.cryptocompare.com'
      },
      {
        protocol: 'https',
        hostname: 'images2.cryptocompare.com'
      },
      {
        protocol: 'https',
        hostname: 'images3.cryptocompare.com'
      },
      {
        protocol: 'https',
        hostname: 'resources.cryptocompare.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'greekonomics.org',
          },
        ],
        destination: 'https://www.greekonomics.org',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
