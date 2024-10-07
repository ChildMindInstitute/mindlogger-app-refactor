import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { getDefaultNavigationService } from '@app/screens/lib/navigationServiceInstance';

export function useInitialRouteNavigation() {
  const { navigate } = useNavigation();

  useEffect(() => {
    const initialRoute = getDefaultNavigationService().getInitialRoute();

    if (initialRoute) {
      // @react-navigation's poor type inference
      // @ts-ignore
      navigate(initialRoute.route, initialRoute.params);
    }
  }, [navigate]);
}
