module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Expo Router用プラグインを追加
      require.resolve('expo-router/babel'),
    ],
  };
};