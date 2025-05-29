import {
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet } from 'react-native';

import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutRight,
  SlideOutLeft,
  EntryExitAnimationFunction,
  useSharedValue,
  FadeOut,
} from 'react-native-reanimated';

import { range } from '../lib/utils/common';

export type ViewSliderProps = PropsWithChildren<{
  viewCount: number;
  step: number;
  renderView: (item: { index: number }) => JSX.Element;
}>;

export type ViewSliderRef = {
  next: (step?: number) => void;
  back: (step?: number) => void;
};

type Direction = 'left' | 'right' | 'not-specified';

const SlideInLeftAnimation = new SlideInLeft().duration(300).build();
const SlideInRightAnimation = new SlideInRight().duration(300).build();
const SlideOutLeftAnimation = new SlideOutLeft().duration(300).build();
const SlideOutRightAnimation = new SlideOutRight().duration(300).build();
const FadeInAnimation = new FadeIn().build();
const FadeOutAnimation = new FadeOut().build();

export const ViewSlider = forwardRef<ViewSliderRef, ViewSliderProps>(
  ({ viewCount, step = 0, renderView }, ref) => {
    const views = useMemo(() => range(viewCount), [viewCount]);

    const currentIndexRef = useRef<number>(step);

    const enteringDirection = useSharedValue<Direction>('not-specified');
    const exitingDirection = useSharedValue<Direction>('not-specified');

    const isLast = step === views.length - 1;

    const next = useCallback(
      (shift: number = 1) => {
        const currentIndex = currentIndexRef.current;
        const canMove = shift > 0 && currentIndex + shift < views.length;

        if (canMove) {
          currentIndexRef.current = currentIndex + shift;
          enteringDirection.value = 'right';
          exitingDirection.value = 'left';
        } else {
          enteringDirection.value = 'not-specified';
          exitingDirection.value = 'not-specified';
        }

        return canMove;
      },
      [enteringDirection, exitingDirection, views.length],
    );

    const back = useCallback(
      (shift: number = 1) => {
        const currentIndex = currentIndexRef.current;
        const canMove = shift > 0 && currentIndex - shift >= 0;

        if (canMove) {
          currentIndexRef.current = currentIndex - shift;
          enteringDirection.value = 'left';
          exitingDirection.value = 'right';
        }

        return canMove;
      },
      [enteringDirection, exitingDirection],
    );

    const EnteringAnimation: EntryExitAnimationFunction = (values: any) => {
      'worklet';

      if (enteringDirection.value === 'not-specified') {
        return FadeInAnimation(values);
      }

      return enteringDirection.value === 'right'
        ? SlideInRightAnimation(values)
        : SlideInLeftAnimation(values);
    };

    const ExitingAnimation: EntryExitAnimationFunction = (values: any) => {
      'worklet';

      if (exitingDirection.value === 'not-specified') {
        return FadeOutAnimation(values);
      }

      return exitingDirection.value === 'left'
        ? SlideOutLeftAnimation(values)
        : SlideOutRightAnimation(values);
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          next,
          back,
        };
      },
      [back, next],
    );

    return (
      <Animated.View
        style={styles.box}
        key={step}
        entering={EnteringAnimation}
        exiting={isLast ? undefined : ExitingAnimation}
      >
        {renderView({ index: step })}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  box: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
});
