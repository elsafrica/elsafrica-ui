/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REACT_APP_BASE_URL: 'http://127.0.0.1:8080/api'
  },
  images: {
    remotePatterns: [{
      hostname: '127.0.0.1',
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
