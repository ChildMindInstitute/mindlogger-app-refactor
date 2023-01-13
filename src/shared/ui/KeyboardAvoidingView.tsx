import { KeyboardAvoidingView } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

setupReactNative(KeyboardAvoidingView);

export default styled(
  KeyboardAvoidingView,
  {
    name: 'KeyboardAvoidingView',
  },
  {
    isReactNative: true,
  },
);
