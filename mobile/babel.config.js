module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          allowUndefined: true,
        },
      ],

      // Your path aliases
      [
        'module-resolver',
        {
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            components: './src/components',
            screens: './src/screens',
            assets: './src/assets',
            navigations: './src/navigations',
            types: './src/types',
            utils: './src/utils',
            stores: './src/stores',
            hooks: './src/hooks',
            configs: './src/configs',
            managers: './src/managers',
            services: './src/services',
            atoms: './src/atoms',
          },
        },
      ],

      // Must always be last
      'react-native-reanimated/plugin',
    ],
  };
};
