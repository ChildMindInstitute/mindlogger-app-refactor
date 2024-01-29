import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';

import { Canvas, Group, Path, SkPath } from '@shopify/react-native-skia';
import {
  Gesture,
  GestureDetector,
  TouchData,
} from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { useCallbacksRefs } from '@app/shared/lib';

import LineSketcher, { Point, Shape } from './LineSketcher';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialLines: Array<Point[]>;
  width: number;
  onStrokeStart: (x: number, y: number) => void;
  onStrokeChanged: (x: number, y: number) => void;
  onStrokeEnd: () => void;
};

const SketchCanvas = forwardRef<SketchCanvasRef, Props>((props, ref) => {
  const { initialLines, width, onStrokeStart, onStrokeChanged, onStrokeEnd } =
    props;

  const [paths, setPaths] = useState<Array<SkPath>>(() =>
    initialLines.map(points => LineSketcher.createPathFromPoints(points)),
  );

  const callbacksRef = useCallbacksRefs({
    onStrokeStart,
    onStrokeChanged,
    onStrokeEnd,
  });

  const currentTouchIdRef = useSharedValue<number | null>(null);
  const sizeRef = useSharedValue(width);
  const lineSketcher = useMemo(() => new LineSketcher(), []);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        setPaths([]);
      },
    };
  });

  const styles = useMemo(
    () =>
      StyleSheet.flatten({
        width: width,
        height: width,
      }),
    [width],
  );

  const onTouchStart = useCallback(
    (touchInfo: Point) => {
      const path = lineSketcher.createLine(touchInfo);

      setPaths(currentPaths => [...currentPaths, path]);
      callbacksRef.current.onStrokeStart(touchInfo.x, touchInfo.y);
    },
    [callbacksRef, lineSketcher],
  );

  const onTouchProgress = useCallback(
    (touchInfo: Point) => {
      const lastDrawnPoint = lineSketcher.getLastPoint();

      if (lastDrawnPoint) {
        const dx = touchInfo.x - lastDrawnPoint.x;
        const dy = touchInfo.y - lastDrawnPoint.y;

        const isSamePoint = dx === 0 && dy === 0;

        if (isSamePoint) {
          return;
        }
      }

      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y);

      setPaths(currentPaths => {
        const pathsCount = currentPaths.length;
        const lastPath = currentPaths[pathsCount - 1];

        if (lineSketcher.shouldCreateNewLine()) {
          const lastPoint = lastPath.getLastPt();
          const path = lineSketcher.createLine(touchInfo, lastPoint);

          return [...currentPaths, path];
        } else {
          lineSketcher.progressLine(lastPath, touchInfo);

          return [...currentPaths.slice(0, -1), lastPath];
        }
      });
    },
    [callbacksRef, lineSketcher],
  );

  const createDot = useCallback(
    (touchInfo: Point) => {
      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y);

      setPaths(currentPaths => {
        const pathsCount = currentPaths.length;
        const lastPath = currentPaths[pathsCount - 1];

        lineSketcher.progressLine(lastPath, touchInfo);

        return [...currentPaths.slice(0, -1), lastPath];
      });
    },
    [callbacksRef, lineSketcher],
  );

  const onTouchEnd = useCallback(() => {
    if (lineSketcher.getCurrentShape() === Shape.Dot) {
      const firstPoint = lineSketcher.getFirstPoint() as Point;

      createDot({
        x: firstPoint.x + 1.5,
        y: firstPoint.y + 1.5,
      });
    }

    callbacksRef.current.onStrokeEnd();
  }, [callbacksRef, createDot, lineSketcher]);

  const isOutOfCanvas = useCallback(
    (point: Point) => {
      'worklet';
      return (
        point.x > sizeRef.value ||
        point.y > sizeRef.value ||
        point.x < 0 ||
        point.y < 0
      );
    },
    [sizeRef],
  );

  const normalizeCoordinates = useCallback(
    (touchData: TouchData, deviation: number = 0): TouchData => {
      'worklet';
      const normalize = (value: number) => {
        if (value < 0) {
          return 0 + deviation;
        }

        if (value > sizeRef.value) {
          return sizeRef.value - deviation;
        }

        return value;
      };

      return {
        ...touchData,
        x: normalize(touchData.x),
        y: normalize(touchData.y),
      };
    },
    [sizeRef],
  );

  const drawingGesture = useMemo(
    () =>
      Gesture.Pan()
        .manualActivation(true)
        .onTouchesDown((event, stateManager) => {
          if (event.numberOfTouches === 1) {
            const touchId = event.allTouches[0].id;

            currentTouchIdRef.value = touchId;
            stateManager.activate();
          }
        })
        .onTouchesUp((event, stateManager) => {
          const shouldEndGesture = event.changedTouches.some(
            touchData => touchData.id === currentTouchIdRef.value,
          );

          if (shouldEndGesture) {
            stateManager.end();
            currentTouchIdRef.value = null;
          }
        })
        .onBegin(event => {
          runOnJS(onTouchStart)(event);
        })
        .onTouchesMove((event, manager) => {
          const touchData = event.allTouches[0];

          if (isOutOfCanvas(touchData)) {
            const finalPoint = normalizeCoordinates(touchData);
            // It is crucial to create an anchor point in this case before the final step
            // because the lines are painted as curved lines that rely on anchors.
            const anchorFinalPoint = normalizeCoordinates(touchData, 1);

            runOnJS(onTouchProgress)(anchorFinalPoint);
            runOnJS(onTouchProgress)(finalPoint);

            manager.end();
          } else {
            runOnJS(onTouchProgress)(touchData);
          }
        })
        .onFinalize(() => {
          runOnJS(onTouchEnd)();
        }),
    [
      currentTouchIdRef,
      isOutOfCanvas,
      normalizeCoordinates,
      onTouchEnd,
      onTouchProgress,
      onTouchStart,
    ],
  );

  return (
    <GestureDetector gesture={drawingGesture}>
      <Canvas style={styles}>
        <Group>
          {paths.map((path, i) => (
            <Path
              key={i}
              path={path}
              strokeWidth={1.5}
              color="black"
              style="stroke"
            />
          ))}
        </Group>
      </Canvas>
    </GestureDetector>
  );
});

export default SketchCanvas;
