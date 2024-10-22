import { MMKV } from 'react-native-mmkv';

import { InitialRoute } from './types';

export type INavigationService = {
  setInitialRoute: (route: InitialRoute) => void;
  clearInitialRoute: () => void;
  getInitialRoute: () => InitialRoute | undefined;
  getStorage: () => MMKV;
};
