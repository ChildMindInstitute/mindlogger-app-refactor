import React, { FC } from 'react';
import { StatusBar as BaseStatusBar, Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

const StatusBar: FC = () => {
  return <BaseStatusBar barStyle={isIOS ? 'dark-content' : 'light-content'} />;
};

export default StatusBar;
