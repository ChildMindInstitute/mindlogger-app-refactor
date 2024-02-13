import type { NavigationState } from '@react-navigation/native';

import { RootStackParamList, ScreenRoute } from '../config';
import { navigationService } from '../lib';

const ROUTES_TO_PERSIST: ScreenRoute[] = ['AppletDetails'];

export function onScreenChanged(
  navigationState: NavigationState<RootStackParamList>,
) {
  const history = navigationState.routes;
  const currentScreen = history[history.length - 1];

  if (ROUTES_TO_PERSIST.includes(currentScreen.name)) {
    navigationService.setInitialRoute({
      route: currentScreen.name,
      params: currentScreen.params,
    });
  } else {
    navigationService.clearInitialRoute();
  }
}

export const clearInitialRoute = navigationService.clearInitialRoute;
