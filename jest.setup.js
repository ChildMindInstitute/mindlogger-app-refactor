import { jest } from '@jest/globals';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

import './jest.components.jsx';

jest.mock('react-native-file-access', () => {
  return {
    FileSystem: {
      exists: jest.fn((uri) => uri.endsWith('.jpg')), // Mock exists() to return true for .jpg files
    },
    Dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: () => {},
    },
  };
});

require('react-native-reanimated/src/reanimated2/jestUtils').setUpTests();

jest.mock('react-native-reanimated', () => {
  global.__reanimatedWorkletInit = () => {};
  global.ReanimatedDataMock = {
    now: () => 0,
  };

  const Mock = require('react-native-reanimated/mock');

  const MockAnimation = jest.fn().mockImplementation(() => {
    const instance = {
      duration: jest.fn(() => instance),
      build: jest.fn(() => instance),
    };

    return instance;
  });

  return {
    ...Mock,
    SlideInLeft: MockAnimation,
    SlideInRight: MockAnimation,
    SlideOutLeft: MockAnimation,
    SlideOutRight: MockAnimation,
    FadeIn: MockAnimation,
    FadeOut: MockAnimation,
  };
});

jest.mock('react-native-background-fetch', () => jest.mock('react-native-background-fetch'));
jest.mock('@react-native-firebase/messaging', () => jest.mock('@react-native-firebase/messaging'));

jest.mock('@georstat/react-native-image-cache', () => jest.mock('@georstat/react-native-image-cache'));

jest.mock('@react-native-community/geolocation', () => jest.mock('@react-native-community/geolocation'));

jest.mock('react-native-sensors', () => jest.mock('react-native-sensors'));

jest.mock('mixpanel-react-native', () => jest.mock('mixpanel-react-native'));

jest.mock('react-native-tcp-socket', () => {
  return {
    createConnection: () => {
      return {
        on: jest.fn(),
        destroy: jest.fn(),
      };
    },
  };
});

jest.mock('@shopify/react-native-skia', () => {
  global.SkiaApi = {
    Color: jest.fn(),
    FontMgr: {
      RefDefault: jest.fn(),
    },
    Point: jest.fn(),
  };

  global.SkiaValueApi = {
    createValue: jest.fn().mockImplementation((v) => v),
    createDerivedValue: jest.fn(),
    createAnimation: jest.fn(),
    createClockValue: jest.fn(),
  };

  return {
    Skia: {
      Paint: () => ({
        setColor: jest.fn(),
        setStrokeWidth: jest.fn(),
        setStyle: jest.fn(),
      }),
      Color: jest.fn(),
    },
    PaintStyle: {
      Stroke: 1,
    },
  };
});

jest.mock('axios', () => {
  const defaults = {
    headers: {
      common: {
        'Content-Type': '',
      },
    },
  };

  return {
    create: () => {
      return {
        defaults,
      };
    },
    post: () => {},
    defaults,
  };
});

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'));

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

jest.mock('@notifee/react-native', () => require('@notifee/react-native/jest-mock'));
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

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('react-native-gesture-handler', () => jest.mock('react-native-gesture-handler'));
