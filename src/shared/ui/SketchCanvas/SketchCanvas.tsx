import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';

import { Canvas, Path, Skia, SkPath } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import {
  createLine,
  createPathFromPoints,
  getCurrentShape,
  Point,
  progressLine,
  Shape,
} from './LineSketcher';
import { useDrawingGesture } from './useDrawingGesture';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialLines: Array<Point[]>;
  onStrokeStart: (x: number, y: number, time: number) => void;
  onStrokeChanged: (x: number, y: number, time: number) => void;
  onStrokeEnd: (x: number, y: number, time: number) => void;
};

export const SketchCanvas = forwardRef<SketchCanvasRef, Props>((props, ref) => {
  const { initialLines, onStrokeStart, onStrokeChanged, onStrokeEnd } = props;

  const fullPath = useSharedValue<SkPath>(
    initialLines
      .map(points => createPathFromPoints(points))
      .reduce((path, curr) => path.addPath(curr), Skia.Path.Make()),
  );

  const points = useSharedValue<Point[]>([]);

  const lastPointTime = useSharedValue<number | null>(null);
  const width = useSharedValue(0);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        fullPath.value = Skia.Path.Make();
      },
    };
  });

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
      <Canvas
        style={styles.canvas}
        onLayout={e => (width.value = e.nativeEvent.layout.width)}
      >
        <Path path={fullPath} strokeWidth={1.5} color="black" style="stroke" />
      </Canvas>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
