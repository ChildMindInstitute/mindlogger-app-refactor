import { StyleSheet, TextInput } from 'react-native';

import { GetProps, styled } from '@tamagui/core';
import { useFocusable } from '@tamagui/focusable';

import { IS_IOS } from '../lib/constants';
import { palette } from '../lib/constants/palette';

export const InputFrame = styled(
  TextInput,
  {
    name: 'Input',
    focusable: true,

    outlineWidth: 0,
    minWidth: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: StyleSheet.hairlineWidth * 1.5,
    underlineColorAndroid: 'transparent',

    m: 0,
    px: 12,
    py: 12,

    fontSize: 16,
    height: 48,
    selectionColor: IS_IOS ? palette.on_surface : palette.on_surface_alpha30,
    placeholderTextColor: palette.outline,

    variants: {
      mode: {
        light: {
          color: '$on_surface',
          borderBottomColor: '$outline_variant',
        },
        dark: {
          color: '$on_primary',
          borderBottomColor: '#1e1d1d',
        },
        survey: {
          px: 0,
          borderBottomWidth: 1,
          borderBottomColor: '$outline_variant',
          color: '$on_surface',
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
