import { FC, PropsWithChildren } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { AsyncStorage, ONE_HOUR } from '@shared/lib';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      cacheTime: Infinity,
      retry: 0,
    },
    queries: {
      retry: 2,
      cacheTime: ONE_HOUR * 24,
    },
  },
});

const asyncPersist = createAsyncStoragePersister({
  key: 'OFFLINE_CACHE',
  storage: AsyncStorage,
  throttleTime: 1000,
});

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    const status =
      state.isConnected != null &&
      state.isConnected &&
      Boolean(state.isInternetReachable);

    setOnline(status);
  });
});

if (__DEV__) {
  import('react-query-native-devtools').then(({ addPlugin }) => {
    addPlugin({ queryClient });
  });
}

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        maxAge: ONE_HOUR * 24,
        persister: asyncPersist,
        buster: 'kill-cache',
      }}
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }>
      {children}
    </PersistQueryClientProvider>
  );
};

export default ReactQueryProvider;
