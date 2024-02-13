import { useCallback } from 'react';

import { NavigationProp, useNavigation } from '@react-navigation/native';

const peekCurrentRoute = (
  navigation: NavigationProp<ReactNavigation.RootParamList>,
) => {
  const navigationState = navigation.getState();
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
    () => peekCurrentRoute(navigation),
    [navigation],
  );

  return {
    getCurrentRoute,
  };
};

export default useCurrentRoute;
