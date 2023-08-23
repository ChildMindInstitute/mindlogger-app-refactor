import NetInfo from '@react-native-community/netinfo';

import { onNetworkUnavailable } from '../alerts';
import { Logger } from '../services';

export const isAppOnline = async (): Promise<boolean> => {
  const networkState = await NetInfo.fetch();

  const result =
    networkState.isConnected != null &&
    networkState.isConnected &&
    Boolean(networkState.isInternetReachable);

  return result;
};

export const executeIfOnline = (callback: (...args: any[]) => unknown) => {
  isAppOnline().then(isOnline => {
    if (isOnline) {
      callback();
    } else {
      onNetworkUnavailable();
    }
  });
};

const WatchInterval = 30000;

export const watchForConnectionLoss = () => {
  const abortController = new AbortController();

  const checkWithAbort = () => {
    isAppOnline().then(result => {
      if (!result) {
        abortController.abort();
        clearInterval(id);
        Logger.warn('[watchForConnectionWithAbort]: Connection aborted');
      }
    });
  };

  checkWithAbort();

  const id = setInterval(() => {
    checkWithAbort();
  }, WatchInterval);

  return {
    abortController,
    reset: () => {
      clearInterval(id);
    },
  };
};
