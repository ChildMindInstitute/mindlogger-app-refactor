import { useCallback } from 'react';

import { useNavigation, NavigationState } from '@react-navigation/native';

const peekCurrentRoute = (navigationState: NavigationState | undefined) => {
  if (!navigationState) {
    return undefined;
  }
  const length = navigationState.routes.length;
  const lastRoute = navigationState.routes[length - 1];
  return lastRoute.name;
};

const useCurrentRoute = () => {
  const navigation = useNavigation();

  const getCurrentRoute = useCallback(
    () => peekCurrentRoute(navigation.getState()),
    [navigation],
  );

  return {
    getCurrentRoute,
  };
};

export default useCurrentRoute;
