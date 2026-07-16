// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    // Add any custom transformer options here
  },
  resolver: {
    ...defaultConfig.resolver,
    // Add custom resolver options here
  },
};


// const { getDefaultConfig } = require('@react-native/metro-config');
// const path = require('path');

// module.exports = (async () => {
//   const defaultConfig = await getDefaultConfig(__dirname);

//   return {
//     transformer: {
//       ...defaultConfig.transformer,
//       babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: true,
//         },
//       }),
//     },
//     resolver: {
//       ...defaultConfig.resolver,
//       sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
//       // Force RN internals through Babel (very important)
//       blockList: undefined,
//       disableHierarchicalLookup: false,
//     },
//     watchFolders: [
//       path.resolve(__dirname, 'node_modules'),
//     ],
//   };
// })();
