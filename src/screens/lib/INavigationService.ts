import { NavigationState } from '@react-navigation/routers';
import { MMKV } from 'react-native-mmkv';

import { RootStackParamList } from '../config/types';

export const NavigationServiceScopes = {
  Default: 'default',
  ActiveAssessment: 'activeAssessment',
} as const;
export type NavigationServiceScope =
  (typeof NavigationServiceScopes)[keyof typeof NavigationServiceScopes];

export type INavigationService = {
  setInitialNavigationState: (
    state: NavigationState<RootStackParamList>,
    scope: NavigationServiceScope,
  ) => void;
  clearInitialNavigationState: (scope: NavigationServiceScope) => void;
  getInitialNavigationState: (
    scope: NavigationServiceScope,
  ) => NavigationState<RootStackParamList> | undefined;
  getStorage: () => MMKV;
};
