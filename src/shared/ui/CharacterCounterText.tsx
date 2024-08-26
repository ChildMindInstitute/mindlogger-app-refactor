import { Text } from 'react-native';

import { setupReactNative, styled } from '@tamagui/core';

setupReactNative({
  Text,
});

const CharacterCounterText = styled(
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
  },
  {
    inlineProps: new Set(['style']),
  },
);

export default CharacterCounterText;
