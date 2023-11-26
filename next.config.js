/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_BASE_URL: 'http://174.138.95.187:8080',
    SOCKET_BASE_URL: 'http://http://174.138.95.187:8080',
  },
  images: {
    remotePatterns: [{
      hostname: '174.138.95.187',
      protocol: 'http',
      port: '8080'
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
