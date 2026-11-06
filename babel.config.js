const { execSync } = require('child_process');

process.env.TAMAGUI_TARGET = 'native';
process.env.VERSION = require('./package.json').version;

if (!process.env.CI) {
  // Abbreviated Git hash (`abababa` or `abababa-dirty`) to use as local build number
  process.env.GIT_REVISION = execSync(
    "git describe --exclude='*' --always --abbrev=7 --dirty",
  )
    .toString()
    .trim();
  // Current date to use as local version number
  const now = new Date();
  process.env.VERSION = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map(n => String(n).padStart(2, '0'))
    .join('.');
}

module.exports = {
  presets: ['module:@react-native/babel-preset'],
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
        },
      },
    ],
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV', 'TAMAGUI_TARGET', 'VERSION', 'GIT_REVISION'],
      },
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
};
