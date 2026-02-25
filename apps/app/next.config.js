/** @type {import('next').NextConfig} */
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',

  basePath: isProd ? '/wkd2ev-post-example' : '',

  assetPrefix: isProd ? '/wkd2ev-post-example/' : '',

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  transpilePackages: ['my-design-system'],

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, '../../packages/atalssian-design-system/src');
    return config;
  },
};

module.exports = nextConfig;
