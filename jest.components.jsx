import React from 'react';

import { jest } from '@jest/globals';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

jest.mock('@georstat/react-native-image-cache', () => {
  return {
    CachedImage: () => <></>,
  };
});
