import { StyleSheet, TextInput } from 'react-native';

import { GetProps, setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';

setupReactNative({
  TextInput,
});

export const InputFrame = styled(
  TextInput,
  {
    name: 'Input',
    focusable: true,

    outlineWidth: 0,
    minWidth: 0,
    backgroundColor: '$backgroundTransparent',
    borderBottomWidth: StyleSheet.hairlineWidth * 1.5,
    underlineColorAndroid: 'transparent',

    m: 0,
    px: 12,
    py: 8,

    fontSize: 20,
    selectionColor: 'black',

    variants: {
      variant: {
        light: {
          color: '$secondary',
          placeholderTextColor: '#ffffff99',
          borderBottomColor: '#ffffff99',
        },
        dark: {
          color: '$darkGrey',
          placeholderTextColor: '#3b3a3a',
          borderBottomColor: '#1e1d1d',
        },
      },
      isInvalid: {
        true: {
          borderBottomColor: '$alert',
        },
      },
    },

    defaultVariants: {
      variant: 'light',
    },
  },
  {
    isInput: true,
  },
);

export type InputProps = GetProps<typeof InputFrame>;

export default focusableInputHOC(InputFrame);
