import { FC, useEffect } from 'react';

import { styled } from '@tamagui/core';
import {
  Easing,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';

import { Box } from '@shared/ui';

import TimerClock from '../TimerClock';

const TimerContainer = styled(Box, {
  position: 'absolute',
  top: 10,
  right: 10,
});

type Props = {
  onFinish: () => void;
  duration: number;
};

const Timer: FC<Props> = ({ onFinish, duration }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      {
        duration,
        easing: Easing.linear,
      },
      isFinished => {
        if (isFinished) {
          runOnJS(onFinish)();
        }
      },
    );
  }, [duration, onFinish, progress]);

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

        <TimerClock progress={progress} duration={10000} />
      </Svg>
    </TimerContainer>
  );
};

export default Timer;
