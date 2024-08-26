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

    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1,

    minHeight: 176,
    maxHeight: 350,
    width: '100%',
    borderRadius: 12,
    borderWidth: 2,
    outlineWidth: 0,
    padding: 8,
    gap: 10,

    backgroundColor: '$backgroundTransparent',
    underlineColorAndroid: 'transparent',
    selectionColor: 'black',
    borderColor: '$lighterGrey7',
    color: '$onSurface',
    focusStyle: {
      borderColor: '$primary',
    },

    fontSize: 20,

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
