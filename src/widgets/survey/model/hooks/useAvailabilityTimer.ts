import { useEffect } from 'react';
import { useRef } from 'react';

import { AppTimer } from '@app/shared/lib/timers/AppTimer';
import { getNow } from '@app/shared/lib/utils/dateTime';

import { InterimInActionPostponer } from '../services/InterimInActionPostponer';

type UseTimerInput = {
  onFinish: () => void;
  availableTo: number | null;
};

export const useAvailabilityTimer = (input: UseTimerInput) => {
  const { onFinish, availableTo } = input;

  const duration = availableTo ? availableTo - getNow().getTime() : 0;

  const timerLogicIsUsed = duration > 0;

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

  const postponer = useRef(
    new InterimInActionPostponer(() => finishRef.current()),
  ).current;

  useEffect(() => {
    if (!timerLogicIsUsed) {
      return;
    }

    const timer = new AppTimer(
      () => {
        console.log('useAvailabilityTimer, tick');

        postponer.tryExecute();
        timer.stop();
      },
      false,
      duration,
    );

    timer.start();

    return () => {
      timer.stop();
      postponer.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
