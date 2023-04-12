import { FC } from 'react';

import Animated, {
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  duration: number;
  progress: SharedValue<number>;
};

const AnimatedTimerCircle: FC<Props> = ({ progress }) => {
  const animatedStrokeDashoffset = useAnimatedProps(() => {
    return {
      strokeDashoffset: Math.PI * 25 * (1 - progress.value),
    };
  });

  return (
    <AnimatedCircle
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

export default AnimatedTimerCircle;
