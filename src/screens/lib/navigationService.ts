import { MMKV } from 'react-native-mmkv';

import { INavigationService } from './INavigationService';
import { InitialRoute } from './types';

export function NavigationService(navigationStorage: MMKV): INavigationService {
  return {
    setInitialRoute(route: InitialRoute) {
      navigationStorage.set('initialRoute', JSON.stringify(route));
    },

    clearInitialRoute() {
      navigationStorage.delete('initialRoute');
    },

    getInitialRoute() {
      const value = navigationStorage.getString('initialRoute');

      if (value) {
        return JSON.parse(value) as InitialRoute;
      }
    },

    getStorage() {
      return navigationStorage;
    },
  };
}
