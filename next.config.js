/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "images.pexels.com",
      "connect-social-media-bucket.s3.us-east-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
