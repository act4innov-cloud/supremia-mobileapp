module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'react-native-reanimated/plugin',
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@': './src',
              '@components': './src/components',
              '@services': './src/services',
              '@hooks': './src/hooks',
              '@contexts': './src/contexts',
              '@stores': './src/stores',
              '@config': './src/config',
              '@types': './src/types',
              '@utils': './src/utils',
              '@assets': './src/assets',
            },
          },
        ],
      ],
    };
  };