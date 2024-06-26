import { FC, PropsWithChildren, useEffect, useState } from 'react';

import {
  LDProvider,
  ReactNativeLDClient,
} from '@launchdarkly/react-native-client-sdk';

import { FeatureFlagsService, Logger, useSystemBootUp } from '@app/shared/lib';

const FeatureFlagsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized } = useSystemBootUp();
  const [ldClient, setClient] = useState<ReactNativeLDClient>();

  useEffect(() => {
    FeatureFlagsService.init()
      .then(client => {
        Logger.log('[FeatureFlagsProvider]: Initialized');

        setClient(client);
        onModuleInitialized('featureFlags');
      })
      .catch(error => {
        Logger.error(`[FeatureFlagsProvider]: Failed to initialize\n${error}`);
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

export default FeatureFlagsProvider;
