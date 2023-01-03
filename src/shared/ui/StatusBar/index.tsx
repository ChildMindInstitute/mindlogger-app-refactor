import React, { FC } from 'react';
import { StatusBar as BaseStatusBar } from 'react-native';

import { IS_IOS } from '@shared/lib/constants';

const StatusBar: FC = () => {
  return <BaseStatusBar barStyle={IS_IOS ? 'dark-content' : 'light-content'} />;
};

export default StatusBar;
