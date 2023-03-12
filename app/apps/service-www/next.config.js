const webpack = require('webpack');
const withNx = require('@nrwl/next/plugins/with-nx');
/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  "@blocto/sdk",
  "@project-serum/anchor",
  "@project-serum/sol-wallet-adapter",
  "@solana/wallet-adapter-base",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-bitkeep",
  "@solana/wallet-adapter-bitpie",
  "@solana/wallet-adapter-blocto",
  "@solana/wallet-adapter-clover",
  "@solana/wallet-adapter-coin98",
  "@solana/wallet-adapter-coinhub",
  "@solana/wallet-adapter-ledger",
  "@solana/wallet-adapter-mathwallet",
  "@solana/wallet-adapter-phantom",
  "@solana/wallet-adapter-safepal",
  "@solana/wallet-adapter-slope",
  "@solana/wallet-adapter-solflare",
  "@solana/wallet-adapter-sollet",
  "@solana/wallet-adapter-solong",
  "@solana/wallet-adapter-tokenpocket",
  "@solana/wallet-adapter-torus",
  "@solana/wallet-adapter-wallets",
]);
// const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  webpack5: true,

  pageExtensions: ['jsx', 'js', 'ts', 'tsx'],

  basePath: '',

  images: {
    domains: ["verrb57eqriqhp7sjr4cfw3rxhbmm7z2iwt6clfhlhyspxqplrsa.arweave.net", "www.arweave.net"]
  },

  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    config.resolve.fallback = { fs: false, crypto: false, path: false, stream: false };

    // config.resolve.alias['components'] = path.join(__dirname, 'components');
    // config.resolve.alias['containers'] = path.join(__dirname, 'containers');
    // config.resolve.alias['libraries'] = path.join(__dirname, 'libraries');
    // config.resolve.alias['utils'] = path.join(__dirname, 'utils');

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.SWAP_ROBOT_PROGRAM_ID": `"${process.env.SWAP_ROBOT_PROGRAM_ID || ''}"`,
        "process.env.CANDY_MACHINE_CONFIG_PDA": `"${process.env.CANDY_MACHINE_CONFIG_PDA || ''}"`,
        "process.env.SWAP_ROBOT_PROGRAM_STATE_PDA": `"${process.env.SWAP_ROBOT_PROGRAM_STATE_PDA || ''}"`,
        "process.env.STORAGE_PART_TYPE_PDA": `"${process.env.STORAGE_PART_TYPE_PDA || ''}"`,
        "process.env.MAGIC_EDEN_SOL_ROBOTS_CREATOR": `"${process.env.MAGIC_EDEN_SOL_ROBOTS_CREATOR || ''}"`,
        "process.env.MAGIC_EDEN_BOT_ROBOTS_CREATOR": `"${process.env.MAGIC_EDEN_BOT_ROBOTS_CREATOR || ''}"`,
        "process.env.STARBOTS_PARTS_CREATOR": `"${process.env.STARBOTS_PARTS_CREATOR || ''}"`,
        "process.env.BURN_WALLET": `"${process.env.BURN_WALLET || ''}"`,
        "process.env.DEBUG": `"${process.env.DEBUG || ''}"`,
        "process.env.SOLANA_ENV": `"${process.env.SOLANA_ENV || ''}"`,
        "process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT": `"${isServer ? process.env.GRAPHQL_GATEWAY_SERVER : process.env.GRAPHQL_GATEWAY_CLIENT}"`,
        "process.env.CLUSTER_API_URL": `"${process.env.CLUSTER_API_URL || ''}"`,
      })
    );

    return config;
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = withTM(withNx(nextConfig));
