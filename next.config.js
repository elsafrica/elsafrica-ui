/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_BASE_URL: 'http://174.138.95.187:8080/api',
    SOCKET_BASE_URL: 'http://174.138.95.187:8080',
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
