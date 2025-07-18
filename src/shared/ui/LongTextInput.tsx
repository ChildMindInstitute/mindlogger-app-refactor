import { TextInput } from 'react-native';

import { GetProps, styled } from '@tamagui/core';
import { useFocusable } from '@tamagui/focusable';
import { isTablet } from 'react-native-device-info';

import { IS_IOS } from '../lib/constants';
import { palette } from '../lib/constants/palette';

const LongTextInputView = styled(
  TextInput,
  {
    name: 'ParagraphText',

    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1,
    textAlignVertical: 'top',

    minHeight: 176,
    maxHeight: isTablet() ? 350 : null,
    width: '100%',
    borderRadius: 12,
    borderWidth: 2,
    outlineWidth: 0,
    p: 12,
    gap: 10,

    backgroundColor: 'transparent',
    underlineColorAndroid: 'transparent',
    selectionColor: IS_IOS ? palette.on_surface : palette.on_surface_alpha30,
    placeholderTextColor: palette.outline,
    borderColor: '$outline_variant',
    color: '$on_surface',
    focusStyle: {
      borderColor: '$primary',
    },

    fontFamily: '$body',
    fontSize: 20,

    focusable: true,
    multiline: true,
    scrollEnabled: isTablet(),
  },
  {
    isInput: true,
  },
);

export type InputProps = GetProps<typeof LongTextInputView>;

// This is a direct port of the focusableInputHOC Tamagui function that we used to use here.
// That function no longer exists, and it seems the signature of Component.styleable has changed as well. However,
// this seems to still work as expected. Therefore, I'm ignoring the TypeScript error for now.
// See https://github.com/tamagui/tamagui/blob/d425febf0a2577e7fc621a48d2315d804f7c4341/code/ui/focusable/src/focusableInputHOC.tsx#L64
// See https://github.com/tamagui/tamagui/commit/3bce1c316797d55d5675afe3dbd9f18d55ef8ff7
export const LongTextInput = LongTextInputView.styleable(
  // @ts-ignore
  (props: InputProps, ref) => {
    const isInput = LongTextInputView.staticConfig?.isInput;
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

    return <LongTextInputView ref={combinedRef} {...finalProps} />;
  },
);
