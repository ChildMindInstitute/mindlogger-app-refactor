import { NavigationState } from '@react-navigation/routers';
import { MMKV } from 'react-native-mmkv';

import {
  INavigationService,
  NavigationServiceScope,
} from './INavigationService';
import { RootStackParamList } from '../config/types';

export function NavigationService(navigationStorage: MMKV): INavigationService {
  return {
    setInitialNavigationState(
      state: NavigationState<RootStackParamList>,
      scope: NavigationServiceScope,
    ) {
      navigationStorage.set(
        `initialNavigationState-${scope}`,
        JSON.stringify(state),
      );
    },

    clearInitialNavigationState(scope: NavigationServiceScope) {
      navigationStorage.delete(`initialNavigationState-${scope}`);
    },

    getInitialNavigationState(scope: NavigationServiceScope) {
      const value = navigationStorage.getString(
        `initialNavigationState-${scope}`,
      );

      if (value) {
        return JSON.parse(value) as NavigationState<RootStackParamList>;
      }
    },

    getStorage() {
      return navigationStorage;
    },
  };
}
