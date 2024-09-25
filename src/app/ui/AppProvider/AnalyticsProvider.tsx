import { FC, PropsWithChildren, useEffect } from 'react';

import { AnalyticsService } from '@app/shared/lib/analytics/AnalyticsService';
import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSystemBootUp();

  useEffect(() => {
    AnalyticsService.init().then(() => {
      getDefaultLogger().log('[AnalyticsProvider]: Initialized');

      onModuleInitialized('analytics');
    });
  }, [onModuleInitialized]);

  return <>{children}</>;
};
