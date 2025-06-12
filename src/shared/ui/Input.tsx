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

// This is a direct port of the focusableInputHOC Tamagui function that we used to use here.
// That function no longer exists, and it seems the signature of Component.styleable has changed as well. However,
// this seems to still work as expected. Therefore, I'm ignoring the TypeScript error for now.
// See https://github.com/tamagui/tamagui/blob/d425febf0a2577e7fc621a48d2315d804f7c4341/code/ui/focusable/src/focusableInputHOC.tsx#L64
// See https://github.com/tamagui/tamagui/commit/3bce1c316797d55d5675afe3dbd9f18d55ef8ff7
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
