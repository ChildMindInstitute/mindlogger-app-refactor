import { KeyboardAvoidingView as RNKeyboardAvoidingView } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

setupReactNative(RNKeyboardAvoidingView);

export const KeyboardAvoidingView = styled(
  RNKeyboardAvoidingView,
  {
    name: 'KeyboardAvoidingView',
  },
  {
    isReactNative: true,
  },
);
