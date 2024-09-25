import { ActivityIndicator as RNActivityIndicator } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

setupReactNative(RNActivityIndicator);

export const ActivityIndicator = styled(
  RNActivityIndicator,
  {
    name: 'ActivityIndicator',
    testID: 'loader',
  },
  {
    isReactNative: true,
  },
);
