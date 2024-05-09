import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';

import { navigationService } from '../../lib';

function useInitialRouteNavigation() {
  const { navigate } = useNavigation();

  useEffect(() => {
    const initialRoute = navigationService.getInitialRoute();

    if (initialRoute) {
      // @react-navigation's poor type inference
      // @ts-ignore
      navigate(initialRoute.route, initialRoute.params);
    }
  }, [navigate]);
}

export default useInitialRouteNavigation;
