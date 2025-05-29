import { StyleSheet, TextInput } from 'react-native';

import { GetProps, setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';

import { IS_IOS } from '../lib/constants';
import { colors } from '../lib/constants/colors';

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
      mode: {
        light: {
          color: '$secondary',
          placeholderTextColor: '#ffffff99',
          borderBottomColor: '#ffffff99',
        },
        dark: {
          color: '$darkGrey',
          placeholderTextColor: IS_IOS ? colors.lightGrey : colors.grey,
          borderBottomColor: '#1e1d1d',
        },
        survey: {
          borderBottomWidth: 1,
          borderBottomColor: '$mediumGrey',
          color: '$black',
          fontSize: 18,
          focusStyle: {
            borderBottomColor: '$darkGrey',
            maxHeight: 100,
          },
        },
      },
      isInvalid: {
        true: {
          borderBottomColor: '$alert',
        },
      },
    },

    defaultVariants: {
      mode: 'light',
    },
  },
  {
    isInput: true,
  },
);

export type InputProps = GetProps<typeof InputFrame>;

export const Input = focusableInputHOC(InputFrame);
