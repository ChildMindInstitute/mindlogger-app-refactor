import type { NavigationState } from '@react-navigation/native';

import { RootStackParamList, ScreenRoute } from '../config/types';
import { getDefaultNavigationService } from '../lib/navigationServiceInstance';

const ROUTES_TO_PERSIST: ScreenRoute[] = ['AppletDetails'];

export function onScreenChanged(
  navigationState: NavigationState<RootStackParamList>,
) {
  const history = navigationState.routes;
  const currentScreen = history[history.length - 1];

  if (ROUTES_TO_PERSIST.includes(currentScreen.name)) {
    getDefaultNavigationService().setInitialRoute({
      route: currentScreen.name,
      params: currentScreen.params,
    });
  } else {
    getDefaultNavigationService().clearInitialRoute();
  }
}

export const clearInitialRoute =
  getDefaultNavigationService().clearInitialRoute;
