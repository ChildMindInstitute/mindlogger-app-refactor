import { NavigationState } from '@react-navigation/routers';

import { RootStackParamList } from '../../config/types';

/**
 * Drops the persisted bottom-tab selection under AppletDetails so a restored
 * session lands on the navigator's initialRouteName (ActivityList) rather than
 * on whichever tab was open when the app was last closed.
 */
export const dropAppletDetailsTabState = (
  state: NavigationState<RootStackParamList> | undefined,
): NavigationState<RootStackParamList> | undefined => {
  if (!state?.routes?.length) {
    return state;
  }

  let changed = false;

  const routes = state.routes.map(route => {
    if (route.name !== 'AppletDetails' || route.state === undefined) {
      return route;
    }

    changed = true;

    const { state: _tabState, ...routeWithoutState } = route;
    return routeWithoutState;
  });

  return changed ? { ...state, routes } : state;
};
