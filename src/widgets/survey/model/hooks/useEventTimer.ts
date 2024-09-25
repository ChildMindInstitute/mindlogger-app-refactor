import { useEffect } from 'react';
import { useRef } from 'react';

import { AppTimer } from '@app/shared/lib/timers/AppTimer';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import {
  getMsFromHours,
  getMsFromMinutes,
} from '@app/shared/lib/utils/dateTime';

import { InterimInActionPostponer } from '../services/InterimInActionPostponer';

type UseTimerInput = {
  onFinish: () => void;
  entityStartedAt: number;
  timerHourMinute?: HourMinute | null;
};

export const useEventTimer = (input: UseTimerInput) => {
  const { onFinish, entityStartedAt, timerHourMinute } = input;

  const durationBySettings = timerHourMinute
    ? getMsFromHours(timerHourMinute.hours) +
      getMsFromMinutes(timerHourMinute.minutes)
    : 0;

  const timerLogicIsUsed = durationBySettings > 0;

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

  const postponer = useRef(
    new InterimInActionPostponer(() => finishRef.current()),
  ).current;

  useEffect(() => {
    if (!timerLogicIsUsed) {
      return;
    }

    const alreadyElapsed: number = Date.now() - entityStartedAt;

    const noTimeLeft: boolean = alreadyElapsed > durationBySettings;

    if (noTimeLeft) {
      finishRef.current();
      return;
    }

    const durationLeft = durationBySettings - alreadyElapsed;

    const timer = new AppTimer(
      () => {
        postponer.tryExecute();
        timer.stop();
      },
      false,
      durationLeft,
    );

    timer.start();

    return () => {
      timer.stop();
      postponer.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
