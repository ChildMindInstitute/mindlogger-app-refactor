import React, { FC, PropsWithChildren } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import {
  createSyncStorage,
  isAppOnline,
  queryClient,
  useSystemBootUp,
} from '@shared/lib';

const storage = createSyncStorage('cache-storage');

const syncPersist = createSyncStoragePersister({
  key: 'OFFLINE_CACHE',
  storage,
  throttleTime: 1000,
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    const status =
      state.isConnected != null &&
      state.isConnected &&
      Boolean(state.isInternetReachable);

    const mutations = queryClient.getMutationCache().getAll();

    setOnline(status);

    if (mutations.length && status) {
      queryClient.resumePausedMutations();
    }
  });
});

if (__DEV__) {
  const { addPlugin } = require('react-query-native-devtools');

  addPlugin({ queryClient });
}

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  const onCacheRestored = () => {
    isAppOnline().then(isOnline => {
      if (isOnline) {
        onlineManager.setOnline(true);
        queryClient.resumePausedMutations();
      }
    });

    onModuleInitialized('cache');
  };

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: Infinity,
        persister: syncPersist,
        buster: 'kill-cache',
      }}
      onSuccess={onCacheRestored}
    >
      {initialized && children}
    </PersistQueryClientProvider>
  );
};

export default ReactQueryProvider;
