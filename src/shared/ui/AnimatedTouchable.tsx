import { useMemo } from 'react';

import {
  AnimateProp,
  MotiPressable,
  MotiPressableProps,
} from 'moti/interactions';

import { palette } from '../lib/constants/palette';

type Props = MotiPressableProps & {
  idleStyle?: NonNullable<AnimateProp>;
  pressStyle?: NonNullable<AnimateProp>;
  duration?: number;
};

/**
 * Wrapper component for making an element smoothly transition when pressed. Defaults to
 * a simple color change, between the `surface` and `secondary_container` color tokens.
 *
 * Note: All of Tamagui's base components have built-in support for animated pressStyle,
 * however that seemed to break after the React Native 0.79 upgrade. There are no errors,
 * it's just that Tamagui animations seem to have simply stopped running. Tried with the
 * RN Animated support library (@tamagui/animations-react-native) as well as with the
 * Reanimated support library (@tamagui/animations-moti), no luck with either.
 *
 * So using MotiPressable for now.
 */
export function AnimatedTouchable({
  children,
  idleStyle = {
    backgroundColor: palette.surface,
  },
  pressStyle = {
    backgroundColor: palette.neutral99_and_neutral10_012,
  },
  duration = 200,
  ...props
}: Props) {
  return (
    <MotiPressable
      animate={useMemo(
        () =>
          ({ pressed }) => {
            'worklet';
            return pressed ? pressStyle : idleStyle;
          },
        [pressStyle, idleStyle],
      )}
      transition={{ duration }}
      {...props}
    >
      {children}
    </MotiPressable>
  );
}
