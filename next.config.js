/** @type {import('next').NextConfig} */
const path = require("path");
const { i18n } = require("./next-i18next.config");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const { redirect } = require('next/dist/server/api-utils');

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src 'self, *.faro.xyz';
`;

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];

const nextConfig = {
  transpilePackages: [
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],
  env: {
    API_HOST: process.env.API_HOST,
    MAGIC_AUTH_KEY: process.env.MAGIC_AUTH_KEY,
    BICONOMY_ETHEREUM_GOERLI_DAPP_API_KEY:
      process.env.BICONOMY_ETHEREUM_GOERLI_DAPP_API_KEY,
    BICONOMY_POLYGON_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_POLYGON_MAINNET_DAPP_API_KEY,
    BICONOMY_POLYGON_MUMBAI_DAPP_API_KEY:
      process.env.BICONOMY_POLYGON_MUMBAI_DAPP_API_KEY,
    BICONOMY_ETHEREUM_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_ETHEREUM_MAINNET_DAPP_API_KEY,
    BICONOMY_ARBITRUM_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_ARBITRUM_MAINNET_DAPP_API_KEY,
    BICONOMY_ARBITRUM_GOERLI_DAPP_API_KEY:
      process.env.BICONOMY_ARBITRUM_GOERLI_DAPP_API_KEY,
    BICONOMY_AVALANCHE_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_AVALANCHE_MAINNET_DAPP_API_KEY,
    BICONOMY_AVALANCHE_FUJI_DAPP_API_KEY:
      process.env.BICONOMY_AVALANCHE_FUJI_DAPP_API_KEY,
    BICONOMY_BSC_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_BSC_MAINNET_DAPP_API_KEY,
    BICONOMY_BSC_TESTNET_DAPP_API_KEY:
      process.env.BICONOMY_BSC_TESTNET_DAPP_API_KEY,
    BICONOMY_FANTOM_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_FANTOM_MAINNET_DAPP_API_KEY,
    BICONOMY_FANTOM_TESTNET_DAPP_API_KEY:
      process.env.BICONOMY_FANTOM_TESTNET_DAPP_API_KEY,
    BICONOMY_OPTIMISM_MAINNET_DAPP_API_KEY:
      process.env.BICONOMY_OPTIMISM_MAINNET_DAPP_API_KEY,
    BICONOMY_OPTIMISM_GOERLI_DAPP_API_KEY:
      process.env.BICONOMY_OPTIMISM_GOERLI_DAPP_API_KEY,
    API_BICONOMY: process.env.API_BICONOMY,
    MORALIS_API_KEY: process.env.API_KEY_MORALIS,
    API_MORALIS: process.env.API_MORALIS,
    DEFAULT_STORE: process.env.DEFAULT_STORE,
    DEFAULT_CHAIN: process.env.DEFAULT_CHAIN,
    PASS_VERSION: process.env.PASS_VERSION,
    DEFAULT_CALLING_COUTRY: process.env.DEFAULT_CALLING_COUTRY,
    SUPPORTED_PHONE_COUNTRIES: process.env.SUPPORTED_PHONE_COUNTRIES,
    FIREBASE_VAPID_KEY: process.env.FIREBASE_VAPID_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    ALWAYS_SHOW_PASS: process.env.ALWAYS_SHOW_PASS,
  },
  i18n,
  reactStrictMode: false,
  output: "standalone",
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(pdf|epub)?$/,
      type: "asset/resource",
      generator: {
        filename: "static/[hash][ext]",
      },
    });

    // The .js file you want to create
    const fileContent = `const process = {
      env: {
        projectId: '${process.env.FIREBASE_PROJECT_ID}',
        apiKey: '${process.env.FIREBASE_API_KEY}',
        authDomain: '${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com',
        databaseURL: 'https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com',
        storageBucket: '${process.env.FIREBASE_PROJECT_ID}.appspot.com',
        messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
        appId: '${process.env.FIREBASE_APP_ID}',
      }
    }`;

    // The path of the file
    const filePath = path.join(__dirname, "public", "env.js");

    // Create the file
    fs.writeFileSync(filePath, fileContent, "utf8");

    // Configure webpack to copy the file to the public folder
    config.plugins.push(
      new CopyPlugin({
        patterns: [{ from: "public", to: "" }],
      })
    );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "faro-assets.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "faro-assets.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bc.passkit.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/apaman",
        destination: "/store/aruarumembers", // replace apaman with aruarumembers for production
        permanent: true,
      },
      {
        source: "/store/apaman",
        destination: "/store/aruarumembers", // replace apaman with aruarumembers for production
        permanent: true,
      },
      {
        source: "/apaman/:path*",
        destination: "/store/aruarumembers/:path", // replace apaman with aruarumembers for production
        permanent: true,
      },
      {
        source: "/store/apaman/:path*",
        destination: "/store/aruarumembers/:path", // replace apaman with aruarumembers for production
        permanent: true,
      },
      {
        source: "/aruarucitypassport",
        destination: "/store/aruarumembers", // replace aruarucitypassport with aruarumembers for production
        permanent: true,
      },
      {
        source: "/store/aruarucitypassport",
        destination: "/store/aruarumembers", // replace aruarucitypassport with aruarumembers for production
        permanent: true,
      },
      {
        source: "/aruarucitypassport/:path*",
        destination: "/store/aruarumembers/:path", // replace aruarucitypassport with aruarumembers for production
        permanent: true,
      },
      {
        source: "/store/aruarucitypassport/:path*",
        destination: "/store/aruarumembers/:path", // replace aruarucitypassport with aruarumembers for production
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:title",
        destination: "/store/:title",
      },
      {
        source: "/:title/faq",
        destination: "/store/:title/faq",
      },
      {
        source: "/:title/signout",
        destination: "/store/:title/signout",
      },
      {
        source: "/:title/reset-password",
        destination: "/store/:title/reset-password",
      },
      {
        source: "/:title/verify-email",
        destination: "/store/:title/verify-email",
      },
      {
        source: "/jp/firebase-messaging-sw.js'",
        destination: "/firebase-messaging-sw.js'",
      },
      {
        source: "/en/firebase-messaging-sw.js'",
        destination: "/firebase-messaging-sw.js'",
      },
      {
        source: "/pt/firebase-messaging-sw.js'",
        destination: "/firebase-messaging-sw.js'",
      },
      {
        source: "/es/firebase-messaging-sw.js'",
        destination: "/firebase-messaging-sw.js'",
      }
    ];
  },
};

module.exports = nextConfig;
