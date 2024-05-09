import { createSecureStorage } from '@shared/lib';

import { InitialRoute } from './types';

const storage = createSecureStorage('navigation-storage');

function NavigationService() {
  return {
    setInitialRoute(route: InitialRoute) {
      storage.set('initialRoute', JSON.stringify(route));
    },

    clearInitialRoute() {
      storage.delete('initialRoute');
    },

    getInitialRoute() {
      const value = storage.getString('initialRoute');

      if (value) {
        return JSON.parse(value) as InitialRoute;
      }
    },

    getStorage() {
      return storage;
    },
  };
}

export default NavigationService();
