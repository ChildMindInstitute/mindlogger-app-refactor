import {
  forwardRef,
  useImperativeHandle,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';

import { XStack } from '@tamagui/stacks';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { range } from '../lib';

type Props = PropsWithChildren<{
  viewCount: number;
  startFrom: number;
  renderView: (item: { index: number }) => JSX.Element;
}>;

export type ViewSliderRef = {
  next: (step?: number) => void;
  back: (step?: number) => void;
};

export const ViewSlider = forwardRef<ViewSliderRef, Props>(
  ({ viewCount, startFrom = 0, renderView }, ref) => {
    const views = useMemo(() => range(viewCount), [viewCount]);
    const [width, setWidth] = useState(0);

    const offsetIndex = useSharedValue(0 - startFrom);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: withTiming(offsetIndex.value * width) }],
      };
    });

    const next = useCallback(
      (shift: number = 1) => {
        const currentIndex = Math.abs(offsetIndex.value);
        const canMove = shift > 0 && currentIndex + shift < views.length;

        if (canMove) {
          offsetIndex.value = offsetIndex.value - shift;
        }

        return canMove;
      },
      [offsetIndex, views.length],
    );

    const back = useCallback(
      (shift: number = 1) => {
        const canMove = shift > 0 && offsetIndex.value < 0;

        if (canMove) {
          offsetIndex.value = offsetIndex.value + shift;
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

    return (
      <Animated.View
        style={[styles.box, animatedStyles]}
        onLayout={o => setWidth(o.nativeEvent.layout.width)}
      >
        {views.map(index => {
          const isCurrent = Math.abs(offsetIndex.value) === index;

          return (
            <XStack key={index} w={width}>
              {isCurrent ? (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  exiting={FadeOut.duration(200)}
                  style={styles.slide}
                >
                  {renderView({ index })}
                </Animated.View>
              ) : null}
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
  slide: {
    flex: 1,
  },
});
