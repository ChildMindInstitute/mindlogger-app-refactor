import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { SkPath } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, SharedValue, useSharedValue } from 'react-native-reanimated';

import {
  createLine,
  getCurrentShape,
  Point,
  progressLine,
  Shape,
} from './LineSketcher';
import { useDrawingGesture } from './useDrawingGesture';

type Props = {
  fullPath: SharedValue<SkPath>;
  width: SharedValue<number>;
  onStrokeStart: (x: number, y: number, time: number) => void;
  onStrokeChanged: (x: number, y: number, time: number) => void;
  onStrokeEnd: (x: number, y: number, time: number) => void;
};

// Mounted only while drawing is enabled, so each hide/show cycle unmounts it
// and gives the next stroke a fully reset gesture, without unmounting the Skia
// Canvas. `fullPath` lives in the parent so drawing persists across remounts.
export const DrawingLayer: FC<Props> = ({
  fullPath,
  width,
  onStrokeStart,
  onStrokeChanged,
  onStrokeEnd,
}) => {
  const points = useSharedValue<Point[]>([]);
  const lastPointTime = useSharedValue<number | null>(null);

  const onTouchStart = (point: Point, time: number) => {
    'worklet';
    fullPath.value.addPath(createLine(points, point));
    runOnJS(onStrokeStart)(point.x, point.y, time);
  };

  const onTouchProgress = (
    point: Point,
    straightLine: boolean,
    time: number,
  ) => {
    'worklet';
    const lastDrawnPoint = points.value[points.value.length - 1];

    if (lastDrawnPoint) {
      const dx = point.x - lastDrawnPoint.x;
      const dy = point.y - lastDrawnPoint.y;

      const isSameTime = lastPointTime.value === time;
      const isSamePoint = dx === 0 && dy === 0;

      if (isSamePoint || isSameTime) {
        return;
      }
    }

    lastPointTime.value = time;

    fullPath.modify(value => {
      'worklet';
      progressLine(points, value, point, straightLine);

      return value;
    });

    runOnJS(onStrokeChanged)(point.x, point.y, time);
  };

  const createDot = (point: Point, time: number) => {
    'worklet';
    runOnJS(onStrokeChanged)(point.x, point.y, time);

    fullPath.modify(value => {
      'worklet';
      progressLine(points, value, point);

      return value;
    });
  };

  const onTouchEnd = (point: Point, time: number) => {
    'worklet';
    if (getCurrentShape(points) === Shape.Dot) {
      const firstPoint = points.value[points.value.length - 1];

      createDot(
        {
          x: firstPoint.x + 1.5,
          y: firstPoint.y + 1.5,
        },
        Date.now(),
      );
    }

    runOnJS(onStrokeEnd)(point.x, point.y, time);
  };

  const drawingGesture = useDrawingGesture(
    { areaSize: width },
    { onTouchStart, onTouchProgress, onTouchEnd },
  );

  return (
    <GestureDetector gesture={drawingGesture}>
      <View style={StyleSheet.absoluteFill} />
    </GestureDetector>
  );
};
