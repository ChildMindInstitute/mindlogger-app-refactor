import { FC, PropsWithChildren, useEffect } from 'react';

import { AnalyticsService, Logger, useSystemBootUp } from '@app/shared/lib';

const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSystemBootUp();

  useEffect(() => {
    AnalyticsService.init().then(() => {
      Logger.log('[AnalyticsProvider]: Initialized');

      onModuleInitialized('analytics');
    });
  }, [onModuleInitialized]);

  return <>{children}</>;
};

export default AnalyticsProvider;
