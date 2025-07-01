import { StatusBar as RNStatusBar } from 'react-native';

import { styled } from '@tamagui/core';

import { IS_IOS } from '../lib/constants';

export const StatusBar = styled(RNStatusBar, {
  barStyle: IS_IOS ? 'dark-content' : 'light-content',
});
