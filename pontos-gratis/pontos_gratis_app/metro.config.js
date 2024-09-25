// metro.config.js

const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  crypto: require.resolve('expo-crypto'), // Redirect 'crypto' to 'expo-crypto'
  buffer: require.resolve('buffer'),      // Redirect 'buffer' to polyfill
};

module.exports = defaultConfig;

