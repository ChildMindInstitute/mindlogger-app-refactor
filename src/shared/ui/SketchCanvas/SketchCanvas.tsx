import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

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

  const lastPointTimeRef = useRef<number | null>(null);

  const currentTouchIdRef = useSharedValue<number | null>(null);
  const sizeRef = useSharedValue(width);
  const lineSketcher = useMemo(() => new LineSketcher(), []);

  useImperativeHandle(ref, () => {
    return {
      clear() {
        canvasRef.current?.clear();
      },
    };
  });

  const onTouchStart = useCallback(
    (touchInfo: Point, time: number) => {
      const path = lineSketcher.createLine(touchInfo);

      lastPointTimeRef.current = time;
      canvasRef.current?.addPath(path);
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

        const isSameTime = lastPointTimeRef.current === time;
        const isSamePoint = dx === 0 && dy === 0;

        if (isSamePoint || isSameTime) {
          return;
        }
      }

      lastPointTimeRef.current = time;
      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y, time);

      canvasRef.current?.changeLastPath(lastPath => {
        lineSketcher.progressLine(lastPath, touchInfo, straightLine);

        return lastPath;
      });
    },
    [callbacksRef, lineSketcher],
  );

  const createDot = useCallback(
    (touchInfo: Point, time: number) => {
      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y, time);

      canvasRef.current?.changeLastPath(lastPath => {
        lineSketcher.progressLine(lastPath, touchInfo);

        return lastPath;
      });
    },
    [callbacksRef, lineSketcher],
  );

  const onTouchEnd = useCallback(() => {
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

    lastPointTimeRef.current = null;
    callbacksRef.current.onStrokeEnd();
  }, [callbacksRef, createDot, lineSketcher]);

  const drawingGesture = useMemo(
    () =>
      DrawingGesture(
        { sizeRef, currentTouchIdRef },
        { onTouchStart, onTouchProgress, onTouchEnd },
      ),
    [currentTouchIdRef, onTouchEnd, onTouchProgress, onTouchStart, sizeRef],
  );

  useEffect(() => {
    canvasRef.current?.initialize(
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
