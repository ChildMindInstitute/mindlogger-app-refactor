import { Text } from 'react-native';

import { setupReactNative, styled } from '@tamagui/core';
import { focusableInputHOC } from '@tamagui/focusable';

import { colors } from '../lib';

setupReactNative({
  Text,
});

export const CharacterCounterText = styled(
  Text,
  {
    name: 'CharacterCounterText',
    flex: 1,
    borderWidth: 0,
    padding: 2,
    margin: 2,
    marginRight: 10,

    focusable: true,

    style: {
      fontWeight: '400',
    },

    variants: {
      fontSize: (fontSize: number) => ({
        fontSize,
      }),
      color: (color: keyof typeof colors) => ({
        color: colors[color] || color,
      }),
    },
  },
  {
    inlineProps: new Set(['fontSize', 'color']),
  },
);

export default focusableInputHOC(CharacterCounterText);
