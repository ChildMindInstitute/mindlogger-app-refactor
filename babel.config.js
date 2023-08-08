process.env.TAMAGUI_TARGET = 'native';
process.env.VERSION = require('./package.json').version;

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src',
          '@assets': './assets',
          '@shared': './src/shared',
          '@features': './src/features',
          '@screens': './src/screens',
          '@entities': './src/entities',
          '@jobs': './src/jobs',
          '@images': './assets/images/index',
          '@widgets': './src/widgets',
          crypto: 'react-native-quick-crypto',
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
        },
      },
    ],
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV', 'TAMAGUI_TARGET', 'VERSION'],
      },
    ],
    ['@babel/plugin-proposal-export-namespace-from'],
    'react-native-reanimated/plugin',
  ],
};
