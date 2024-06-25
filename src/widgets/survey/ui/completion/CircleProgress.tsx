import React from 'react';

import Animated, {
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { Svg, Circle } from 'react-native-svg';

import { colors } from '@app/shared/lib';
import { Box } from '@app/shared/ui';

type Props = {
  size?: number;
  progress: number;
};

const PI = Math.PI;

const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);

export default ({ size = 86, progress }: Props) => {
  const strokeWidth = 12;
  const circleSize = size - strokeWidth;
  const r = circleSize / 2;
  const cx = size / 2;
  const cy = size / 2;

  const circleLength = 2 * PI * r;

  const strokeDasharray = `${circleLength}, ${circleLength}`;

  const animatedStrokeDashoffset = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(circleLength - circleLength * progress),
    };
  });

  const staticCircleProps = {
    strokeWidth,
    r,
    cx,
    cy,
  };

  return (
    <Box w={size} h={size} transform={'rotate(90deg)'}>
      <Svg width={size} height={size} fill="none">
        <Circle fill="none" stroke={colors.lightBlue2} {...staticCircleProps} />

        <AnimatedSvgCircle
          fill="none"
          stroke={colors.blue3}
          strokeDasharray={strokeDasharray}
          animatedProps={animatedStrokeDashoffset}
          {...staticCircleProps}
        />
      </Svg>
    </Box>
  );
};
