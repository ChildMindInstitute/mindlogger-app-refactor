import { StatusBar as RNStatusBar } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

import { IS_IOS } from '../lib/constants';

setupReactNative(RNStatusBar);

export const StatusBar = styled(RNStatusBar, {
  barStyle: IS_IOS ? 'dark-content' : 'light-content',
});
