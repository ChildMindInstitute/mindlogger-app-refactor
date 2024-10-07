import { FC, PropsWithChildren, useEffect } from 'react';

import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSystemBootUp();

  useEffect(() => {
    getDefaultAnalyticsService()
      .init()
      .then(() => {
        getDefaultLogger().log('[AnalyticsProvider]: Initialized');

        onModuleInitialized('analytics');
      })
      .catch(console.error);
  }, [onModuleInitialized]);

  return <>{children}</>;
};
