import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import {
  Gesture,
  GestureDetector,
  TouchData,
} from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { useCallbacksRefs } from '@app/shared/lib';

import CanvasBoard, { CanvasBoardRef } from './CanvasBoard';
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

  const canvasRef = useRef<CanvasBoardRef | null>(null);

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
        canvasRef.current?.setPaths([]);
      },
    };
  });

  const onTouchStart = useCallback(
    (touchInfo: Point) => {
      const path = lineSketcher.createLine(touchInfo);

      canvasRef.current?.setPaths(currentPaths => [...currentPaths, path]);
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

      canvasRef.current?.setPaths(currentPaths => {
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

      canvasRef.current?.setPaths(currentPaths => {
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

  useEffect(() => {
    canvasRef.current?.setPaths(
      initialLines.map(points => LineSketcher.createPathFromPoints(points)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureDetector gesture={drawingGesture}>
      <CanvasBoard size={width} ref={canvasRef} />
    </GestureDetector>
  );
});

export default SketchCanvas;
