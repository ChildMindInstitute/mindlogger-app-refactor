import { useMemo } from 'react';

import { AppTimer } from '../';

type AppTimerConfig = {
  duration: number;
  callback: Function;
  onFinish?: Function;
  startImmediately: boolean;
};

const useAppTimer = (appTimerConfig: AppTimerConfig) => {
  const { duration, callback, onFinish, startImmediately } = appTimerConfig;
  return useMemo(
    () => new AppTimer(duration, callback, startImmediately, onFinish),
    [callback, duration, onFinish, startImmediately],
  );
};

export default useAppTimer;
