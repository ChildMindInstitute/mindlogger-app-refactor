import { useMemo } from 'react';

import { AppTimer } from '../';

type AppTimerConfig = {
  duration: number;
  onFinish: Function;
  startImmediately: boolean;
};

const useAppTimer = (appTimerConfig: AppTimerConfig) => {
  const { duration, onFinish, startImmediately } = appTimerConfig;
  return useMemo(
    () => new AppTimer(onFinish, startImmediately, duration),
    [duration, onFinish, startImmediately],
  );
};

export default useAppTimer;
