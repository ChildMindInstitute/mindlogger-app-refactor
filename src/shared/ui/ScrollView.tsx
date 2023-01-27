import { ScrollView } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

setupReactNative(ScrollView);

export default styled(
  ScrollView,
  {
    name: 'ScrollView',
    scrollEnabled: true,
  },
  {
    isReactNative: true,
  },
);
