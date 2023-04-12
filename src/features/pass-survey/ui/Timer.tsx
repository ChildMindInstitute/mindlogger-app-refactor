/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useEffect } from 'react';

import { styled } from '@tamagui/core';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import Animated, {
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

import { useAppSecondTimer } from '@app/shared/lib';
import { Box } from '@shared/ui';

import { ActivityItemIdentityContext } from '../lib';
import { useActivityState } from '../model';

const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);

type AnimatedSvgCircleProps = {
  duration: number;
  progress: SharedValue<number>;
};

type TimerProps = {
  onFinish: () => void;
  duration: number;
  progressDone: number;
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

const Timer: FC<TimerProps> = ({ onFinish, duration, progressDone }) => {
  const { appletId, activityId, eventId } = useContext(
    ActivityItemIdentityContext,
  );

  const { removeTimer, setTimer } = useActivityState({
    appletId,
    activityId,
    eventId,
  });

  const progress = useSharedValue(progressDone);

  const timer = useAppSecondTimer({
    onFinish: () => {
      removeTimer();
      onFinish();
    },
    onSecondPass: (timerId: number) => {
      setTimer(timerId, progress.value);
    },
    duration: duration - duration * progress.value,
  });

  useEffect(() => {
    timer.start();

    return () => timer.stop();
  }, []);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: duration - duration * progress.value,
      easing: Easing.linear,
    });
  }, [progress, duration]);

  return (
    <TimerContainer>
      <Svg height={50} width={50}>
        <Circle
          cx={25}
          cy={25}
          r={12.5}
          fill="transparent"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={25}
        />

        <AnimatedCircle progress={progress} duration={10000} />
      </Svg>
    </TimerContainer>
  );
};

export default Timer;
