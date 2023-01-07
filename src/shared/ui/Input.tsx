import { TextInput } from 'react-native';

import { GetProps, setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';

setupReactNative({
  TextInput,
});

export const InputFrame = styled(
  TextInput,
  {
    name: 'Input',
    outlineWidth: 0,
    focusable: true,
    backgroundColor: '$backgroundTransparent',
    borderColor: '#ffffff99',
    placeholderTextColor: '#ffffff99',
    color: '#fff',
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    m: 0,
    px: 12,
    py: 8,
    fontSize: 20,

    selectionColor: 'black',
    minWidth: 0,

    focusStyle: {
      borderColor: 'white',
    },

    variants: {
      isInvalid: {
        true: {
          borderBottomColor: '#e63232',
        },
      },
    },
  },
  {
    isInput: true,
  },
);

export type InputProps = GetProps<typeof InputFrame>;

export default focusableInputHOC(InputFrame);
