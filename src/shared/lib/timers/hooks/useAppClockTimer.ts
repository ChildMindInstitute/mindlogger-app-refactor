import { useMemo } from 'react';

import { AppClockTimer } from '../model';

type TAppClockTimerConfig = {
  onMinutePass: () => void;
  onFinish?: () => void;
  startImmediately: boolean;
};

const useAppClockTimer = (appClockTimerConfig: TAppClockTimerConfig) => {
  const { startImmediately, onMinutePass, onFinish } = appClockTimerConfig;
  return useMemo(
    () => new AppClockTimer(onMinutePass, startImmediately, onFinish),
    [onFinish, onMinutePass, startImmediately],
  );
};

export default useAppClockTimer;
