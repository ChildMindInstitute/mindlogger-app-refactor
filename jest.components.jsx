import { jest } from '@jest/globals';
import React from 'react';

jest.mock('@georstat/react-native-image-cache', () => {
  return {
    CachedImage: () => <></>,
  };
});
