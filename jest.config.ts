import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  cacheDirectory: '.jest/cache',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@react-native-device-info|@notifee|@miblanchard/react-native-slider|victory-*|@shopify/react-native-skia|react-native-reanimated)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper({
      '@app/*': ['src/*'],
      '@assets/*': ['assets/*'],
      '@shared/*': ['src/shared/*'],
      '@images': ['assets/images/index'],
      '@features/*': ['src/features/*'],
      '@screens': ['src/screens/index'],
      '@screens/*': ['src/screens/*'],
      '@entities/*': ['src/entities/*'],
      '@jobs/*': ['src/jobs/*'],
      '@widgets/*': ['src/widgets/*'],
    }),
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html)$':
      '<rootDir>/assetsTransformer.js',
  },
};

export default jestConfig;
