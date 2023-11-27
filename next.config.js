/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_BASE_URL: 'https://elsafrica.net/api',
    SOCKET_BASE_URL: 'https://elsafrica.net',
  },
  images: {
    remotePatterns: [{
      hostname: 'elsafrica.net',
      protocol: 'https',
      port: ''
    }]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/customers/list',
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig
