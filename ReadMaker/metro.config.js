const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Expo Router用の設定
config.resolver.alias = {
  ...config.resolver.alias,
};

module.exports = config;