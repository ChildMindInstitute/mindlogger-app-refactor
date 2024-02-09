import { FC, memo, useContext, useEffect, useMemo } from 'react';

import { styled } from '@tamagui/core';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

import { ONE_SECOND, isEmptyObject, useAppTimer, useInterval } from '@app/shared/lib';
import { Box } from '@shared/ui';

import { ActivityIdentityContext } from '../lib';
import { useActivityState } from '../model';

const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);

type AnimatedSvgCircleProps = {
  duration: number;
  progress: SharedValue<number>;
};

type TimerProps = {
  onTimeIsUp: () => void;
  duration: number;
};

const TimerContainer = styled(Box, {
  position: 'absolute',
  top: 10,
  right: 10,
});

const AnimatedCircle: FC<AnimatedSvgCircleProps> = ({ progress }) => {
  const animatedStrokeDashoffset = useAnimatedProps(() => {
    return {
      strokeDashoffset: Math.PI * 25 * (1 - progress.value),
    };
  });

  return (
    <AnimatedSvgCircle
      rotation={-90}
      originX={25}
      originY={25}
      cx={25}
      cy={25}
      r={12.5}
      fill="transparent"
      stroke="rgba(0, 103, 160, 0.4)"
      strokeWidth={25}
      animatedProps={animatedStrokeDashoffset}
      strokeDasharray={Math.PI * 25}
    />
  );
};

const Timer: FC<TimerProps> = ({ onTimeIsUp, duration }) => {
  const { appletId, activityId, eventId, order } = useContext(ActivityIdentityContext);

  const { removeTimer, setTimer, activityStorageRecord } = useActivityState({
    appletId,
    activityId,
    eventId,
    order,
  });

  const progressDone = useMemo(() => {
    if (activityStorageRecord?.timers && isEmptyObject(activityStorageRecord?.timers)) {
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

  return (
    <TimerContainer accessibilityLabel="timer-widget">
      <Svg height={50} width={50}>
        <Circle cx={25} cy={25} r={12.5} fill="transparent" stroke="rgba(0, 0, 0, 0.1)" strokeWidth={25} />

        <AnimatedCircle progress={progress} duration={10000} />
      </Svg>
    </TimerContainer>
  );
};

export default memo(Timer);
