import { ScrollView as RNScrollView } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

setupReactNative(RNScrollView);

export const ScrollView = styled(
  RNScrollView,
  {
    name: 'ScrollView',
    scrollEnabled: true,
  },
  {
    isReactNative: true,
  },
);
