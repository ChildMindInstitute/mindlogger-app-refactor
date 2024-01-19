import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Canvas, Group, Path, SkPath } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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

  const onTouchStart = (touchInfo: Point) => {
    const path = lineSketcher.createLine(touchInfo);

    setPaths(currentPaths => [...currentPaths, path]);
    callbacksRef.current.onStrokeStart(touchInfo.x, touchInfo.y);
  };

  const onTouchProgress = (touchInfo: Point) => {
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
  };

  const createDot = (touchInfo: Point) => {
    callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y);

    setPaths(currentPaths => {
      const pathsCount = currentPaths.length;
      const lastPath = currentPaths[pathsCount - 1];

      lineSketcher.progressLine(lastPath, touchInfo);

      return [...currentPaths.slice(0, -1), lastPath];
    });
  };

  const onTouchEnd = () => {
    if (lineSketcher.getCurrentShape() === Shape.Dot) {
      const firstPoint = lineSketcher.getFirstPoint() as Point;

      createDot({
        x: firstPoint.x + 1.5,
        y: firstPoint.y + 1.5,
      });
    }

    callbacksRef.current.onStrokeEnd();
  };

  const drawingGesture = Gesture.Pan()
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
    .onTouchesMove(event => {
      const touchData = event.allTouches[0];

      runOnJS(onTouchProgress)(touchData);
    })
    .onFinalize(() => {
      runOnJS(onTouchEnd)();
    });

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
