import { useMemo } from 'react';

import { AppClockTimer } from '../';

type AppClockTimerConfig = {
  onMinutePass: () => void;
  onFinish?: () => void;
  startImmediately: boolean;
};

const useAppClockTimer = (appClockTimerConfig: AppClockTimerConfig) => {
  const { startImmediately, onMinutePass, onFinish } = appClockTimerConfig;
  return useMemo(
    () => new AppClockTimer(onMinutePass, startImmediately, onFinish),
    [onFinish, onMinutePass, startImmediately],
  );
};

export default useAppClockTimer;
