const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * mqtt.js est un paquet Node : il attend des modules qui n'existent pas sous
 * React Native (`stream`, `buffer`, `url`, `events`…). Sans ces alias, le
 * bundle échoue à la résolution dès le premier `import mqtt from 'mqtt'`.
 *
 * Les paquets listés ci-dessous sont des polyfills navigateur purs, sans code
 * natif. `url` est indispensable car mqtt.js analyse l'URL du broker pour y
 * extraire le port, le chemin et le protocole.
 */
const polyfills = {
  buffer: require.resolve('buffer/'),
  events: require.resolve('events/'),
  process: require.resolve('process/browser'),
  stream: require.resolve('stream-browserify'),
  url: require.resolve('url/'),
  util: require.resolve('util/'),
  string_decoder: require.resolve('string_decoder/'),
  readable_stream: require.resolve('readable-stream'),
};

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...polyfills,
};

module.exports = config;
