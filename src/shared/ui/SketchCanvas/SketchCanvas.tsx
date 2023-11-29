import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { PanResponder, StyleSheet } from 'react-native';

import {
  Canvas,
  Group,
  Path,
  SkPath,
  TouchInfo,
  useTouchHandler,
} from '@shopify/react-native-skia';

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
    (touchInfo: TouchInfo) => {
      const path = lineSketcher.createLine(touchInfo);

      setPaths(currentPaths => [...currentPaths, path]);
      callbacksRef.current.onStrokeStart(touchInfo.x, touchInfo.y);
    },
    [lineSketcher, callbacksRef],
  );

  const onTouchProgress = useCallback(
    (touchInfo: TouchInfo) => {
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
    [lineSketcher, callbacksRef],
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
    [lineSketcher, callbacksRef],
  );

  const onTouchEnd = useCallback(() => {
    if (lineSketcher.getCurrentShape() === Shape.Dot) {
      const firstPoint = lineSketcher.getFirstPoint();

      createDot({
        x: firstPoint.x + 1.5,
        y: firstPoint.y + 1.5,
      });
    }

    callbacksRef.current.onStrokeEnd();
  }, [callbacksRef, lineSketcher, createDot]);

  const touchHandler = useTouchHandler(
    {
      onStart: onTouchStart,
      onActive: onTouchProgress,
      onEnd: onTouchEnd,
    },
    [],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onShouldBlockNativeResponder: () => true,
        onPanResponderTerminationRequest: () => true,
      }),
    [],
  );

  return (
    <Canvas style={styles} onTouch={touchHandler} {...panResponder.panHandlers}>
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
  );
});

export default SketchCanvas;
