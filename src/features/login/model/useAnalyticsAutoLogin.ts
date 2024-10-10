import { useEffect } from 'react';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

export function useAnalyticsAutoLogin() {
  const id = useAppSelector(selectUserId);

  useEffect(() => {
    if (id) {
      getDefaultAnalyticsService().login(id).catch(console.error);
    }
  }, [id]);
}
