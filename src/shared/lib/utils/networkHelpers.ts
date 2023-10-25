import NetInfo from '@react-native-community/netinfo';
import { AxiosError, AxiosResponse } from 'axios';

import { httpService } from '@app/shared/api';

import { wait } from './common';
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
  let intervalId: TimeoutId;

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

const RetryAttempts = 5;
const RetryWaitInterval = 1000;

export const callApiWithRetry = async <TResponse>(
  apiFunction: () => Promise<AxiosResponse<TResponse>>,
  retryErrorCode: number = 502,
): Promise<AxiosResponse<TResponse>> => {
  const isRetryErrorCode = (error: any) => {
    return (error as AxiosError).response?.status === retryErrorCode;
  };

  for (let attempt = 0; attempt < RetryAttempts; attempt++) {
    const isLast = attempt === RetryAttempts - 1;

    try {
      return await apiFunction();
    } catch (error) {
      Logger.warn(
        '[callApiWithRetry]: Error occurred:\nInternal error:\n\n' + error,
      );
      if (!isRetryErrorCode(error) || isLast) {
        throw error;
      }
    }
    await wait(RetryWaitInterval);

    Logger.info('[callApiWithRetry]: Retry api call');
  }

  throw new Error('[callApiWithRetry]: Number of attempts exceed');
};

export const withDataExtraction = <TResponse>(
  apiFunction: () => Promise<AxiosResponse<TResponse>>,
) => {
  return () => {
    return apiFunction().then(response => {
      return {
        data: response.data,
      } as AxiosResponse<TResponse>;
    });
  };
};
