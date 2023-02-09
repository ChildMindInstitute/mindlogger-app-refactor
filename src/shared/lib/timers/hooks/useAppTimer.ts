import { useMemo } from 'react';

import { AppTimer } from '../model';

type TAppTimerConfig = {
  delay: number;
  callback: Function;
  onFinish?: Function;
  startImmediately: boolean;
};

const useAppTimer = (appTimerConfig: TAppTimerConfig) => {
  const { delay, callback, onFinish, startImmediately } = appTimerConfig;
  return useMemo(
    () => new AppTimer(delay, callback, startImmediately, onFinish),
    [callback, delay, onFinish, startImmediately],
  );
};

export default useAppTimer;
