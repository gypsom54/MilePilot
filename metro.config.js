const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Static web assets synced into assets/web/ (do not add 'json' — breaks Metro JSON imports)
config.resolver.assetExts.push('html', 'txt', 'svg');

module.exports = config;
