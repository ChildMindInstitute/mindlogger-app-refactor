import { useMemo } from 'react';

import AppSecondTimer from '../AppSecondTimer';

type Config = {
  onSecondPass: (...args: any[]) => unknown;
  onFinish: (...args: any[]) => unknown;
  duration: number;
};

const useAppSecondTimer = (appSecondTimerConfig: Config) => {
  const { onFinish, onSecondPass, duration } = appSecondTimerConfig;
  return useMemo(
    () => new AppSecondTimer(onSecondPass, onFinish, duration),
    [onFinish, onSecondPass, duration],
  );
};

export default useAppSecondTimer;
