import { FC, PropsWithChildren, useEffect, useState } from 'react';

import {
  LDProvider,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export const FeatureFlagsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSystemBootUp();
  const [ldClient, setClient] = useState<ReactNativeLDClient>();

  useEffect(() => {
    let client: ReactNativeLDClient | undefined;
    try {
      client = getDefaultFeatureFlagsService().init();
    } catch (err) {
      getDefaultLogger().error(
        `[FeatureFlagsProvider]: Failed to initialize\n${err as never}`,
      );
    }
    if (client) {
      getDefaultLogger().log('[FeatureFlagsProvider]: Initialized');
      setClient(client);
      onModuleInitialized('featureFlags');
    }
  }, [onModuleInitialized, setClient]);

  return (
    <>
      {ldClient ? (
        <LDProvider client={ldClient}>{children}</LDProvider>
      ) : (
        children
      )}
    </>
  );
};
