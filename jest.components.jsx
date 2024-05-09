import React from 'react';

import { jest } from '@jest/globals';

jest.mock('@georstat/react-native-image-cache', () => {
  return {
    CachedImage: () => <></>,
  };
});
