import { StyleSheet, TextInput } from 'react-native';

import { GetProps, styled } from '@tamagui/core';

import { IS_IOS } from '../lib/constants';
import { colors } from '../lib/constants/colors';
import { useFocusable } from '@tamagui/focusable';

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

// @ts-ignore
export const Input = InputFrame.styleable((props: InputProps, ref) => {
  const isInput = InputFrame.staticConfig?.isInput;
  const { ref: combinedRef, onChangeText } = useFocusable({
    ref,
    props,
    isInput,
  });
  const finalProps = isInput
    ? {
        ...props,
        onChangeText,
      }
    : props;

  return <InputFrame ref={combinedRef} {...finalProps} />;
});
