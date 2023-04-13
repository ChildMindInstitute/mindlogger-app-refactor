import { useMemo, useRef } from 'react';

import { AppTimer } from '../';

type AppTimerConfig = {
  duration: number;
  onFinish: (...args: any[]) => unknown;
  startImmediately: boolean;
};

const useAppTimer = (appTimerConfig: AppTimerConfig) => {
  const { duration, onFinish, startImmediately } = appTimerConfig;
  const callbacksRef = useRef({ onFinish });

  callbacksRef.current = { onFinish };

  return useMemo(() => {
    const onTimeIsUp = () => callbacksRef.current.onFinish();

    return new AppTimer(onTimeIsUp, startImmediately, duration);
  }, [duration, startImmediately]);
};

export default useAppTimer;
