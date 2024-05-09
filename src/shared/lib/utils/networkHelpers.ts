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
  // eslint-disable-next-line prefer-const
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

const NetworkErrorCode = -1;
const NetworkErrorMessage = 'network error';

export const callApiWithRetry = async <TResponse>(
  apiFunction: () => Promise<AxiosResponse<TResponse>>,
  retryErrorCodes: number[] = [502, NetworkErrorCode],
): Promise<AxiosResponse<TResponse>> => {
  const shouldCheckNetworkError = () =>
    retryErrorCodes.includes(NetworkErrorCode);

  const isNetworkErrorTextInErrorMessage = (error: any) =>
    error.toString().toLowerCase().includes(NetworkErrorMessage);

  const isRetryErrorCode = (error: any) => {
    const status = (error as AxiosError)?.response?.status ?? 0;

    if (status > 0 && retryErrorCodes.includes(status)) {
      return true;
    } else if (
      shouldCheckNetworkError() &&
      isNetworkErrorTextInErrorMessage(error)
    ) {
      return true;
    }
    return false;
  };

  for (let attempt = 0; attempt < RetryAttempts; attempt++) {
    const isLast = attempt === RetryAttempts - 1;

    try {
      const result = await apiFunction();

      if (attempt > 0) {
        Logger.info('[callApiWithRetry]: Retried successfully');
      }

      return result;
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
