import { useEffect } from 'react';

import { selectUserId } from '@app/entities/identity/model/selectors';
import { AnalyticsService } from '@app/shared/lib/analytics/AnalyticsService';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

export function useAnalyticsAutoLogin() {
  const id = useAppSelector(selectUserId);

  useEffect(() => {
    if (id) {
      AnalyticsService.login(id);
    }
  }, [id]);
}
