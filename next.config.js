/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/home/balance',
        permanent: true,
      },
      {
        source: '/loan-withdraw',
        destination: '/loan-withdraw/current',
        permanent: true,
      },
      {
        source: '/savings',
        destination: '/savings/current',
        permanent: true,
      },
      {
        source: '/statistics',
        destination: '/statistics/balance',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
