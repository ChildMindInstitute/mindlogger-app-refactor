import { NavigationProp } from '@react-navigation/native';

export const isActivityExecuting = (
  navigator: NavigationProp<ReactNavigation.RootParamList>,
): boolean => {
  const navigationState = navigator.getState();
  if (!navigationState) {
    return false;
  }
  const length = navigationState.routes.length;
  const lastRoute = navigationState.routes[length - 1];
  return lastRoute.name === 'InProgressActivity';
};
