/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.binance.com" },
      { protocol: "https", hostname: "**.bybit.com" },
      { protocol: "https", hostname: "**.okx.com" },
      { protocol: "https", hostname: "**.bitget.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cryptologos.cc" },
    ],
  },
};

module.exports = nextConfig;
