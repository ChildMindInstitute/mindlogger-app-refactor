import React, { FC, PropsWithChildren } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { createSyncStorage, isAppOnline, useSystemBootUp } from '@shared/lib';

const storage = createSyncStorage('cache-storage');

export const __queryClient__ = new QueryClient({
  defaultOptions: {
    mutations: {
      cacheTime: Infinity,
      retry: 0,
    },
    queries: {
      retry: 2,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  },
});

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

    const mutations = __queryClient__.getMutationCache().getAll();

    setOnline(status);

    if (mutations.length && status) {
      __queryClient__.resumePausedMutations();
    }
  });
});

if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient: __queryClient__ });
  });
}

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const { onModuleInitialized, initialized } = useSystemBootUp();

  const onCacheRestored = () => {
    isAppOnline().then(isOnline => {
      if (isOnline) {
        onlineManager.setOnline(true);
        __queryClient__.resumePausedMutations();
      }
    });

    onModuleInitialized('cache');
  };

  return (
    <PersistQueryClientProvider
      client={__queryClient__}
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
