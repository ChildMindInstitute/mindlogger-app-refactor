import { FC, memo, useCallback, useContext, useEffect, useMemo } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { ONE_SECOND } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppTimer } from '@app/shared/lib/timers/hooks/useAppTimer';
import { useInterval } from '@app/shared/lib/timers/hooks/useInterval';
import { isObjectNotEmpty } from '@app/shared/lib/utils/common';
import { getClockTime } from '@app/shared/lib/utils/dateTime';
import { Box } from '@app/shared/ui/base';
import { ProgressBar } from '@app/shared/ui/ProgressBar';
import { HandlersContext } from '@app/shared/ui/Stepper/contexts';
import { Text } from '@app/shared/ui/Text';

import { ActivityIdentityContext } from '../lib/contexts/ActivityIdentityContext';
import { useActivityState } from '../model/hooks/useActivityState';

type ProgressWithTimerProps = {
  duration?: number | null;
};

type TimerProps = {
  duration: number;
};

const TimerContainer = styled(Box, {
  width: '100%',
  backgroundColor: '#f00',
  marginBottom: 7,
});

const TEN_SECONDS = ONE_SECOND * 10;

const ProgressWithTimerView: FC<ProgressWithTimerProps> = ({ duration }) => {
  return (
    <TimerContainer accessibilityLabel="timer-widget">
      {!!duration && <Timer duration={duration} />}
    </TimerContainer>
  );
};

const Timer: FC<TimerProps> = ({ duration }) => {
  const { t } = useTranslation();
  const { appletId, activityId, eventId, targetSubjectId, order } = useContext(
    ActivityIdentityContext,
  );

  const { next } = useContext(HandlersContext);

  const onTimeIsUp = useCallback(() => {
    next({ isForced: true, shouldAutoSubmit: true });
  }, [next]);

  const { removeTimer, setTimer, activityStorageRecord } = useActivityState({
    appletId,
    activityId,
    eventId,
    targetSubjectId,
    order,
  });

  const progressDone = useMemo(() => {
    if (
      activityStorageRecord?.timers &&
      isObjectNotEmpty(activityStorageRecord?.timers)
    ) {
      return activityStorageRecord.timers[activityStorageRecord.step] ?? 0;
    }

    return 0;
  }, [activityStorageRecord]);

  const progress = useSharedValue(progressDone);

  const { start: startInterval, stop: stopInterval } = useInterval(() => {
    setTimer(activityStorageRecord!.step, progress.value);
  }, ONE_SECOND);

  useAppTimer({
    onFinish: () => {
      stopInterval();

      removeTimer(activityStorageRecord!.step);

      onTimeIsUp();
    },
    duration: duration - duration * progress.value,
  });

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: duration - duration * progress.value,
      easing: Easing.linear,
    });
  }, [progress, duration]);

  useEffect(() => {
    startInterval();

    return () => stopInterval();
  }, [startInterval, stopInterval]);

  if (progressDone === 0) {
    return <ProgressBar progress={0} height={2} />;
  }

  const timeLeft = duration - duration * progress.value;

  const timeIsRunningOut = timeLeft <= TEN_SECONDS;

  const formattedTimeLeft = getClockTime(timeLeft);

  const textColor = timeIsRunningOut ? palette.error : palette.on_surface;

  return (
    <Box mt={-1}>
      <ProgressBar
        progress={progressDone === 0 ? 0 : 1 - progressDone}
        height={2}
      />
      {progressDone !== 0 && (
        <Text
          w="100%"
          textAlign="center"
          position="absolute"
          top={6}
          color={textColor}
        >
          {formattedTimeLeft} {t('activity_time:time_remaining')}
        </Text>
      )}
    </Box>
  );
};

export const ProgressWithTimer = memo(ProgressWithTimerView);
