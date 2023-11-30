import { useEffect } from 'react';

import { IdentityModel } from '@app/entities/identity';
import { AnalyticsService, useAppSelector } from '@shared/lib';

function useAnalyticsAutoLogin() {
  const id = useAppSelector(IdentityModel.selectors.selectUserId);

  useEffect(() => {
    if (id) {
      AnalyticsService.login(id);
    }
  }, [id]);
}

export default useAnalyticsAutoLogin;
