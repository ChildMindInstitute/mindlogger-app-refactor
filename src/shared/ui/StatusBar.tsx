import { StatusBar } from 'react-native';

import { styled, setupReactNative } from '@tamagui/core';

import { IS_IOS } from '../lib/constants';

setupReactNative(StatusBar);

export default styled(StatusBar, {
  barStyle: IS_IOS ? 'dark-content' : 'light-content',
});
