// ============================================================
// SUPREMIA Platform - Metro Configuration
// ============================================================

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable CSS support for web
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Web-specific MQTT polyfill
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer/'),
};

module.exports = config;