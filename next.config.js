/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_BASE_URL: 'https://174.138.95.187/api',
    SOCKET_BASE_URL: 'https://174.138.95.187',
  },
  images: {
    remotePatterns: [{
      hostname: '174.138.95.187',
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
