import { useMemo } from 'react';

import { AppClockTimer } from '../AppClockTimer';

type AppClockTimerConfig = {
  onMinutePass: (...args: any[]) => unknown;
  startImmediately: boolean;
};

export const useAppClockTimer = (appClockTimerConfig: AppClockTimerConfig) => {
  const { startImmediately, onMinutePass } = appClockTimerConfig;
  return useMemo(
    () => new AppClockTimer(onMinutePass, startImmediately),
    [onMinutePass, startImmediately],
  );
};
