import NetInfo from '@react-native-community/netinfo';

import { httpService } from '@app/shared/api';

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

const PingTimeout = 10000;

const ping = async (): Promise<boolean> => {
  const abortController = new AbortController();

  const id = setTimeout(() => {
    abortController.abort();
  }, PingTimeout);

  try {
    const response = await httpService.get('/liveness', {
      signal: abortController.signal,
    });

    return response.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(id);
  }
};

const WatchInterval = 30000;

export const watchForConnectionLoss = (
  mode: 'ping' | 'checkNetworkStatus' = 'ping',
) => {
  const abortController = new AbortController();
  let intervalId: any = 0;

  const checkWithAbort = () => {
    const checkAction = (checkResult: boolean) => {
      if (!checkResult) {
        abortController.abort();
        clearInterval(intervalId);
        Logger.warn('[watchForConnectionWithAbort]: Connection aborted');
      }
    };

    if (mode === 'checkNetworkStatus') {
      isAppOnline().then(result => checkAction(result));
    } else {
      ping().then(result => checkAction(result));
    }
  };

  if (mode === 'checkNetworkStatus') {
    checkWithAbort();
  }

  intervalId = setInterval(() => {
    checkWithAbort();
  }, WatchInterval);

  return {
    abortController,
    reset: () => {
      clearInterval(intervalId);
    },
  };
};
