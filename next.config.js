/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placehold.co', 'ik.imagekit.io'],
  },
  experimental: {
    nextScriptWorkers: true,
  },
};

module.exports = withPWA(nextConfig);
