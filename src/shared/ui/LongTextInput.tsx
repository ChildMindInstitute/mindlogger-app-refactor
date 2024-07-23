import { StyleSheet, TextInput } from 'react-native';

import { GetProps, setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';

import { IS_IOS } from '@shared/lib';

setupReactNative({
  TextInput,
});

export const LongTextInputFrame = styled(
  TextInput,
  {
    name: 'LongTextInput',
    focusable: true,

    outlineWidth: 0,
    minWidth: 0,
    minHeight: 56,
    maxHeight: 350,
    maxWidth: '100%',
    borderWidth: 2,
    backgroundColor: '$backgroundTransparent',
    underlineColorAndroid: 'transparent',
    borderRadius: 4,
    m: 0,
    px: 12,
    py: 8,

    fontSize: 20,
    selectionColor: 'black',

    multiline: true,
    textAlignVertical: 'top',

    scrollEnabled: true,

    padding: 8,
    borderColor: '$mediumGrey',

    variants: {
      mode: {
        light: {
          color: '$secondary',
          placeholderTextColor: '#ffffff99',
          borderBottomColor: '#ffffff99',
        },
        dark: {
          color: '$darkGrey',
          placeholderTextColor: IS_IOS ? '$lightGrey' : '$grey',
          borderColor: '#1e1d1d',
        },
        survey: {
          borderColor: '$mediumGrey',
          color: '$black',
          fontSize: 18,
          focusStyle: {
            borderColor: '$primary',
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

export type InputProps = GetProps<typeof LongTextInputFrame>;

export default focusableInputHOC(LongTextInputFrame);
