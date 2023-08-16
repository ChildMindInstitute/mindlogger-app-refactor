import { jest } from '@jest/globals';

jest.mock('react-native-file-access', () => {
  return {
    FileSystem: {
      exists: jest.fn(uri => uri.endsWith('.jpg')), // Mock exists() to return true for .jpg files
    },
  };
});

jest.mock('react-native-background-fetch', () =>
  jest.mock('react-native-background-fetch'),
);
jest.mock('@react-native-firebase/messaging', () =>
  jest.mock('@react-native-firebase/messaging'),
);

jest.mock('@georstat/react-native-image-cache', () =>
  jest.mock('@georstat/react-native-image-cache'),
);

jest.mock('@react-native-community/geolocation', () =>
  jest.mock('@react-native-community/geolocation'),
);

jest.mock('@shopify/react-native-skia', () => {
  global.SkiaApi = {
    Color: jest.fn(),
    FontMgr: {
      RefDefault: jest.fn(),
    },
    Point: jest.fn(),
  };

  global.SkiaValueApi = {
    createValue: jest.fn().mockImplementation(v => v),
    createDerivedValue: jest.fn(),
    createAnimation: jest.fn(),
    createClockValue: jest.fn(),
  };
});

jest.mock('axios', () => {
  return {
    create: () => {},
    post: () => {},
    defaults: {
      headers: {
        common: {
          'Content-Type': 'aaa',
        },
      },
    },
  };
});

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

jest.mock('react-native-audio-recorder-player', () => {
  return {
    DocumentDir: () => {},
    fetch: () => {},
    base64: () => {},
    android: () => {},
    ios: () => {},
    config: () => {},
    session: () => {},
    fs: {
      dirs: {
        MainBundleDir: () => {},
        CacheDir: () => {},
        DocumentDir: () => {},
      },
    },
    wrap: () => {},
    polyfill: () => {},
    JSONStream: () => {},
  };
});

jest.mock('@notifee/react-native', () =>
  require('@notifee/react-native/jest-mock'),
);
jest.mock('@react-native-community/netinfo', () => {
  return {
    getCurrentConnectivity: jest.fn(),
    isConnectionMetered: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    isConnected: {
      fetch: () => {
        return Promise.resolve(true);
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  };
});
