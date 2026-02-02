/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "toplogos.ru",
      },
    ],
  },
}

module.exports = nextConfig
