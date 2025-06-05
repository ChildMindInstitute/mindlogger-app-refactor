import React, { FC, PropsWithChildren } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { useSystemBootUp } from '@app/shared/lib/contexts/SplashContext';
import { getDefaultQueryClient } from '@app/shared/lib/queryClient/queryClientInstance';
import { createSyncStorage } from '@app/shared/lib/storages/createStorage';
import { isAppOnline } from '@app/shared/lib/utils/networkHelpers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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

    const mutations = getDefaultQueryClient().getMutationCache().getAll();

    setOnline(status);

    if (mutations.length && status) {
      getDefaultQueryClient().resumePausedMutations();
    }
  });
});

export const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  const onCacheRestored = () => {
    isAppOnline().then(isOnline => {
      if (isOnline) {
        onlineManager.setOnline(true);
        getDefaultQueryClient().resumePausedMutations();
      }
    });

    onModuleInitialized('cache');
  };

  return (
    <PersistQueryClientProvider
      client={getDefaultQueryClient()}
      persistOptions={{
        maxAge: Infinity,
        persister: syncPersist,
        buster: 'kill-cache',
      }}
      onSuccess={onCacheRestored}
    >
      {initialized && children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};
