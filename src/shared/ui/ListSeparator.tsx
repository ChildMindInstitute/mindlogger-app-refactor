import { styled, Stack } from '@tamagui/core';

import { palette } from '../lib/constants/palette';

export const ListSeparator = styled(Stack, {
  width: '100%',
  height: 1,
  backgroundColor: palette.outline,
});
