const extraNodeModules = require('node-libs-browser');
module.exports = {
  extraNodeModules,
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    ...(process.env.NO_FLIPPER
      ? { 'react-native-flipper': { platforms: { ios: null } } }
      : {}),
  },
  androidAssets: ['./assets/fonts/'],
};
