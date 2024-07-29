import { TextInput } from 'react-native';

import { GetProps, setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';

setupReactNative({
  TextInput,
});

export const LongTextInput = styled(
  TextInput,
  {
    name: 'ParagraphText',

    m: 0,
    px: 12,
    py: 8,

    minWidth: 0,
    minHeight: 56,
    maxHeight: 350,
    maxWidth: '100%',
    width: '100%',
    borderRadius: 4,
    borderWidth: 2,
    outlineWidth: 0,
    padding: 8,

    backgroundColor: '$backgroundTransparent',
    underlineColorAndroid: 'transparent',
    selectionColor: 'black',
    borderColor: '$mediumGrey',
    color: '$black',
    focusStyle: {
      borderColor: '$primary',
    },

    textAlignVertical: 'top',
    fontSize: 18,

    focusable: true,
    multiline: true,
    scrollEnabled: true,
  },
  {
    isInput: true,
  },
);

export type InputProps = GetProps<typeof LongTextInput>;

export default focusableInputHOC(LongTextInput);
