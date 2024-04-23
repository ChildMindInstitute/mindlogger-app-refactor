import * as constants from '@shared/lib/constants';

jest.mock('@app/shared/lib/constants', () => ({
  __esModule: true,
  ...jest.requireActual('@app/shared/lib/constants'),
  IS_IOS: null,
  IS_ANDROID: null,
}));

export const setPlatform = (platform: 'ios' | 'android') => {
  jest.mock('react-native/Libraries/Utilities/Platform', () => {
    const Platform = jest.requireActual(
      'react-native/Libraries/Utilities/Platform',
    );

    return {
      ...Platform,
      OS: platform,
    };
  });

  // @ts-ignore
  constants.IS_IOS = platform === 'ios';
  // @ts-ignore
  constants.IS_ANDROID = platform === 'android';
};
