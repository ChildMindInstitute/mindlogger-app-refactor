import { ActivityIndicator } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

setupReactNative(ActivityIndicator);

export default styled(
  ActivityIndicator,
  {
    name: 'ActivityIndicator',
    testID: 'loader',
  },
  {
    isReactNative: true,
  },
);
