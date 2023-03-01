import {
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { StyleSheet } from 'react-native';

import { XStack } from '@tamagui/stacks';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = PropsWithChildren<{
  startFrom: number;
}>;

export type ViewSliderRef = {
  next: (step?: number) => void;
  back: (step?: number) => void;
};

export const ViewSlider = forwardRef<ViewSliderRef, Props>(
  ({ startFrom = 0, children }, ref) => {
    const slides = useMemo(
      () => Children.toArray(children).filter(isValidElement),
      [children],
    );
    const [width, setWidth] = useState(0);
    const [deletedSlideIndex, setDeletedSlideIndex] = useState<number | null>(
      null,
    );

    const offsetIndex = useSharedValue(0 - startFrom);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: withTiming(offsetIndex.value * width) }],
      };
    });

    const next = useCallback(
      (shift: number = 1) => {
        const currentIndex = Math.abs(offsetIndex.value);
        const canMove = currentIndex + shift < slides.length;

        if (canMove) {
          offsetIndex.value = offsetIndex.value - shift;
          setDeletedSlideIndex(currentIndex);
        }

        return canMove;
      },
      [offsetIndex, slides.length],
    );

    const back = useCallback(
      (shift: number = 1) => {
        const currentIndex = Math.abs(offsetIndex.value);
        const canMove = offsetIndex.value < 0;

        if (canMove) {
          offsetIndex.value = offsetIndex.value + shift;
          setDeletedSlideIndex(currentIndex);
        }

        return canMove;
      },
      [offsetIndex],
    );

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

    useEffect(() => {
      const timerId = setTimeout(() => {
        setDeletedSlideIndex(null);
      }, 500);

      return () => {
        clearTimeout(timerId);
      };
    }, [deletedSlideIndex]);

    return (
      <Animated.View
        style={[styles.box, animatedStyles]}
        onLayout={o => setWidth(o.nativeEvent.layout.width)}
      >
        {slides.map((child, i) => {
          const isCurrent = Math.abs(offsetIndex.value) === i;
          const isDeleted = deletedSlideIndex === i;

          return (
            <XStack key={i} w={width}>
              {isCurrent || isDeleted ? child : null}
            </XStack>
          );
        })}
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: 'row',
  },
});
