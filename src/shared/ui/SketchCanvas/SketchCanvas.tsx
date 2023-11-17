import {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet } from 'react-native';

import {
  TouchInfo,
  useTouchHandler,
  SkPath,
  SkiaView,
  useDrawCallback,
  SkCanvas,
} from '@shopify/react-native-skia';

import { useCallbacksRefs, useEvaluateOnce } from '@app/shared/lib';

import LineSketcher, { Point } from './LineSketcher';

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  initialPoints: Array<Point>;
  width: number;
  onStrokeStart: (x: number, y: number) => void;
  onStrokeChanged: (x: number, y: number) => void;
  onStrokeEnd: () => void;
};

const SketchCanvas = forwardRef<SketchCanvasRef, Props>((props, ref) => {
  const { initialPoints, width, onStrokeStart, onStrokeChanged, onStrokeEnd } =
    props;

  const startingPaths = useEvaluateOnce(() =>
    initialPoints.length
      ? [LineSketcher.createPathFromPoints(initialPoints)]
      : [],
  );

  const pathsRef = useRef<Array<SkPath>>(startingPaths);
  const canvasRef = useRef<SkCanvas | null>(null);
  const pointsRef = useRef<Array<Point>>([]);

  const skiaViewRef = useRef<SkiaView | null>(null);

  const callbacksRef = useCallbacksRefs({
    onStrokeStart,
    onStrokeChanged,
    onStrokeEnd,
  });

  const lineSketcher = useMemo(
    () => new LineSketcher(pathsRef, canvasRef, pointsRef),
    [],
  );

  const onTouchStart = useCallback(
    (touchInfo: TouchInfo) => {
      lineSketcher.createLine(touchInfo);
      callbacksRef.current.onStrokeStart(touchInfo.x, touchInfo.y);
    },
    [lineSketcher, callbacksRef],
  );

  const onTouchProgress = useCallback(
    (touchInfo: TouchInfo) => {
      lineSketcher.progressLine(touchInfo);
      callbacksRef.current.onStrokeChanged(touchInfo.x, touchInfo.y);
    },
    [lineSketcher, callbacksRef],
  );

  const onTouchEnd = useCallback(() => {
    callbacksRef.current.onStrokeEnd();
    pointsRef.current = [];
    skiaViewRef.current?.redraw();
  }, [callbacksRef]);

  const touchHandler = useTouchHandler(
    {
      onStart: onTouchStart,
      onActive: onTouchProgress,
      onEnd: onTouchEnd,
    },
    [],
  );

  const onDraw = useDrawCallback((canvas, info) => {
    if (!canvas) {
      return;
    }

    canvasRef.current = canvas;

    LineSketcher.drawPaths(canvas, pathsRef.current);

    touchHandler(info.touches);
  });

  useImperativeHandle(ref, () => {
    return {
      clear() {
        pathsRef.current = [];
        skiaViewRef.current?.redraw();
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

  return <SkiaView ref={skiaViewRef} style={styles} onDraw={onDraw} />;
});

export default SketchCanvas;
