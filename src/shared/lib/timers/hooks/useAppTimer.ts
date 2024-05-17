import { useEffect, useRef } from 'react';

import { TimerCallbackFeedback } from '@app/abstract/lib';

import { AppTimer } from '../';

type AppTimerConfig = {
  duration: number;
  onFinish: (...args: any[]) => unknown;
};

const useAppTimer = (appTimerConfig: AppTimerConfig) => {
  const { onFinish, duration } = appTimerConfig;
  const callbacksRef = useRef({ onFinish });
  const durationRef = useRef(duration);

  callbacksRef.current = { onFinish };

  useEffect(() => {
    const onTimerEnd = (): TimerCallbackFeedback => {
      callbacksRef.current.onFinish();
      return 'no-feedback';
    };

    const timer = new AppTimer(onTimerEnd, true, durationRef.current);

    return () => {
      timer.stop();
    };
  }, []);
};

export default useAppTimer;
