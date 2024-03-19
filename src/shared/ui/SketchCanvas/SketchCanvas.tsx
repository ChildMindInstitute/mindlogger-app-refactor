import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { SkPath } from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { useCallbacksRefs } from '@app/shared/lib';

import CanvasBoard, { CanvasBoardRef } from './CanvasBoard';
import DrawingGesture from './DrawingGesture';
import LineSketcher, { Point, Shape } from './LineSketcher';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialLines: Array<Point[]>;
  width: number;
  onStrokeStart: (x: number, y: number, time: number) => void;
  onStrokeChanged: (x: number, y: number, time: number) => void;
  onStrokeEnd: (x: number, y: number, time: number) => void;
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
    (touchInfo: Point, time: number) => {
      const path = lineSketcher.createLine(touchInfo);

      canvasRef.current?.setPaths(currentPaths => [...currentPaths, path]);
      callbacksRef.current.onStrokeStart(touchInfo.x, touchInfo.y, time);
    },
    [callbacksRef, lineSketcher],
  );

  const onTouchProgress = useCallback(
    (touchInfo: Point, straightLine: boolean, time: number) => {
      const lastDrawnPoint = lineSketcher.getLastPoint();

      if (lastDrawnPoint) {
        const dx = touchInfo.x - lastDrawnPoint.x;
        const dy = touchInfo.y - lastDrawnPoint.y;

        const isSamePoint = dx === 0 && dy === 0;

        if (isSamePoint) {
          return;
        }
      }

      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y, time);

      canvasRef.current?.setPaths(currentPaths => {
        const pathsCount = currentPaths.length;
        const lastPath: SkPath | undefined = currentPaths[pathsCount - 1];

        if (!lastPath) {
          return [];
        }

        if (lineSketcher.shouldCreateNewLine()) {
          const lastPoint = lastPath.getLastPt();
          const path = lineSketcher.createLine(touchInfo, lastPoint);

          return [...currentPaths, path];
        } else {
          lineSketcher.progressLine(lastPath, touchInfo, straightLine);

          return [...currentPaths.slice(0, -1), lastPath];
        }
      });
    },
    [callbacksRef, lineSketcher],
  );

  const createDot = useCallback(
    (touchInfo: Point, time: number) => {
      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y, time);

      canvasRef.current?.setPaths(currentPaths => {
        const pathsCount = currentPaths.length;
        const lastPath = currentPaths[pathsCount - 1];

        lineSketcher.progressLine(lastPath, touchInfo);

        return [...currentPaths.slice(0, -1), lastPath];
      });
    },
    [callbacksRef, lineSketcher],
  );

  const onTouchEnd = useCallback(
    (touchInfo: Point, time: number) => {
      if (lineSketcher.getCurrentShape() === Shape.Dot) {
        const firstPoint = lineSketcher.getFirstPoint() as Point;

        createDot(
          {
            x: firstPoint.x + 1.5,
            y: firstPoint.y + 1.5,
          },
          Date.now(),
        );
      }

      callbacksRef.current.onStrokeEnd(touchInfo.x, touchInfo.y, time);
    },
    [callbacksRef, createDot, lineSketcher],
  );

  const drawingGesture = useMemo(
    () =>
      DrawingGesture(
        { sizeRef, currentTouchIdRef },
        { onTouchStart, onTouchProgress, onTouchEnd },
      ),
    [currentTouchIdRef, onTouchEnd, onTouchProgress, onTouchStart, sizeRef],
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
