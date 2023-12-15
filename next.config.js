/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_BASE_URL: 'https://elsafrica.online/api',
    SOCKET_BASE_URL: 'https://elsafrica.online',
  },
  images: {
    remotePatterns: [{
      hostname: 'elsafrica.online',
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
