import { Button } from '@tamagui/button';
import { styled, setupReactNative } from '@tamagui/core';

setupReactNative({
  Button,
});

export default styled(Button, {
  variants: {
    variant: {
      white: {
        borderRadius: 4,
        px: 50,
        fontSize: 20,
        backgroundColor: 'white',
        textProps: { color: '#0067A0' },
      },
    },
  } as const,
});
