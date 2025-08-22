const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add resolver fallbacks for Node.js modules that Colyseus tries to use
config.resolver.fallback = {
  ...config.resolver.fallback,
  https: false,
  http: false,
  crypto: false,
  stream: false,
  buffer: false,
  url: false,
  querystring: false,
  zlib: false,
};

module.exports = withNativeWind(config, { input: "./global.css" });
