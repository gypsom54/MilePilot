const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow bundling static web assets copied into assets/web/
config.resolver.assetExts.push('html', 'txt', 'svg', 'json');

module.exports = config;
