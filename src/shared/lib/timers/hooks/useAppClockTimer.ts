import { useMemo } from 'react';

import { AppClockTimer } from '../';

type AppClockTimerConfig = {
  onMinutePass: (...args: any[]) => unknown;
  startImmediately: boolean;
};

const useAppClockTimer = (appClockTimerConfig: AppClockTimerConfig) => {
  const { startImmediately, onMinutePass } = appClockTimerConfig;
  return useMemo(() => new AppClockTimer(onMinutePass, startImmediately), [onMinutePass, startImmediately]);
};

export default useAppClockTimer;
