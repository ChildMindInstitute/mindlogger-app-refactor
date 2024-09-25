import { FC, PropsWithChildren, useEffect, useState } from 'react';

import {
  LDProvider,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';
import { FeatureFlagsService } from '@app/shared/lib/featureFlags/FeatureFlagsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

export const FeatureFlagsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSystemBootUp();
  const [ldClient, setClient] = useState<ReactNativeLDClient>();

  useEffect(() => {
    FeatureFlagsService.init()
      .then(client => {
        getDefaultLogger().log('[FeatureFlagsProvider]: Initialized');

        setClient(client);
        onModuleInitialized('featureFlags');
      })
      .catch(error => {
        getDefaultLogger().error(
          `[FeatureFlagsProvider]: Failed to initialize\n${error}`,
        );
      });
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
