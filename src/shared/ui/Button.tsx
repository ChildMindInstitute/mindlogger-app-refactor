import { Button } from '@tamagui/button';
import { styled, setupReactNative } from '@tamagui/core';

setupReactNative({
  Button,
});

export default styled(Button, {
  variants: {
    variant: {
      light: {
        borderRadius: 4,
        px: 50,
        fontSize: 20,
        backgroundColor: '$secondary',
        textProps: { color: '$primary' },
      },
    },
  } as const,
});
