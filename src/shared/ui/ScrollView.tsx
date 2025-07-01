import { ScrollView as RNScrollView } from 'react-native';

import { styled } from '@tamagui/core';

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
