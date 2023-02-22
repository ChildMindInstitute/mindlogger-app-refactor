import { styled } from '@tamagui/core';

import { colors } from '../lib';

import { Box } from '.';

const ListSeparator = styled(Box, {
  width: '100%',
  height: 1,
  backgroundColor: colors.lightGrey,
});

export default ListSeparator;
