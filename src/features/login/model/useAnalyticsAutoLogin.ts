import { useEffect } from 'react';

import { IdentityModel } from '@app/entities/identity';
import { AnalyticsService, createStorage, useAppSelector } from '@shared/lib';

export const storage = createStorage('analytics-storage');

function useAnalyticsAutoLogin() {
  const id = useAppSelector(IdentityModel.selectors.selectUserId);

  useEffect(() => {
    const isLoggedIn = storage.getBoolean('IS_LOGGED_IN');

    if (id && !isLoggedIn) {
      AnalyticsService.login(id).then(() => {
        storage.set('IS_LOGGED_IN', true);
      });
    }
  }, [id]);
}

export default useAnalyticsAutoLogin;
