import { forwardRef, memo, useImperativeHandle, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Canvas, Group, Path, Skia, SkPath } from '@shopify/react-native-skia';
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
import useDrawingGesture from './useDrawingGesture';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialLines: Array<Point[]>;
  onStrokeStart: (x: number, y: number, time: number) => void;
  onStrokeChanged: (x: number, y: number, time: number) => void;
  onStrokeEnd: (x: number, y: number, time: number) => void;
};

const MAX_POINTS_PER_LINE = 50;

const SketchCanvas = forwardRef<SketchCanvasRef, Props>((props, ref) => {
  const { initialLines, onStrokeStart, onStrokeChanged, onStrokeEnd } = props;

  const [paths, setPaths] = useState<Array<SkPath>>(() =>
    initialLines.map(points => createPathFromPoints(points)),
  );

  const points = useSharedValue<Point[]>([]);

  const lastPointTime = useSharedValue<number | null>(null);

  const activePath = useSharedValue<SkPath>(Skia.Path.Make());
  const tempPath = useSharedValue<SkPath>(Skia.Path.Make());

  const width = useSharedValue(0);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        activePath.value = Skia.Path.Make();
        setPaths([]);
      },
    };
  });

  function updatePaths(path: SkPath) {
    setPaths(prevPaths => [...prevPaths, path]);
    tempPath.value = Skia.Path.Make();
  }

  const onTouchStart = (point: Point, time: number) => {
    'worklet';
    activePath.value = createLine(points, point);
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

    activePath.modify(value => {
      'worklet';
      progressLine(points, value, point, straightLine);

      return value;
    });

    if (points.value.length % MAX_POINTS_PER_LINE === 0) {
      runOnJS(updatePaths)(activePath.value);

      tempPath.value = activePath.value;

      const lastPoint = activePath.value!.getLastPt();
      const newPath = createLine(points, lastPoint);

      activePath.value = newPath;
    }

    runOnJS(onStrokeChanged)(point.x, point.y, time);
  };

  const createDot = (point: Point, time: number) => {
    'worklet';
    runOnJS(onStrokeChanged)(point.x, point.y, time);

    activePath.modify(value => {
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

    runOnJS(updatePaths)(activePath.value);
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
        <Group>
          <DrawnPaths paths={paths} />

          <Path
            path={activePath}
            strokeWidth={1.5}
            color="black"
            style="stroke"
          />

          <Path
            path={tempPath}
            strokeWidth={1.5}
            color="black"
            style="stroke"
          />
        </Group>
      </Canvas>
    </GestureDetector>
  );
});

type DrawnPathsProps = {
  paths: Array<SkPath>;
};

const DrawnPaths = memo(
  ({ paths }: DrawnPathsProps) => (
    <>
      {paths.map((path, i) => (
        <Path
          key={i}
          path={path}
          strokeWidth={1.5}
          color="black"
          style="stroke"
        />
      ))}
    </>
  ),
  (prevProps, nextProps) => prevProps.paths.length === nextProps.paths.length,
);

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

export default SketchCanvas;
