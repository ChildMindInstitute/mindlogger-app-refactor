import {
  memo,
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
  Skia,
  PaintStyle,
} from '@shopify/react-native-skia';
import { Point } from 'react-native-svg/lib/typescript/elements/Shape';

import { colors } from '@app/shared/lib';

import LineSketcher from './LineSketcher';

const paint = Skia.Paint();
paint.setColor(Skia.Color(colors.black));
paint.setStrokeWidth(1.5);
paint.setStyle(PaintStyle.Stroke);

export type SketchCanvasRef = {
  clear: () => void;
};

type Props = {
  width: number;
};

const SketchCanvas = forwardRef<SketchCanvasRef, Props>(({ width }, ref) => {
  const pathsRef = useRef<Array<SkPath>>([]);

  const canvasRef = useRef<SkCanvas | null>(null);
  const pointsRef = useRef<Array<Point>>([]);

  const skiaViewRef = useRef<SkiaView | null>(null);

  const lineSketcher = useMemo(
    () => new LineSketcher(pathsRef, canvasRef, pointsRef),
    [],
  );

  const onTouchStart = useCallback(
    (touchInfo: TouchInfo) => {
      lineSketcher.createLine(touchInfo);
    },
    [lineSketcher],
  );

  const onTouchProgress = useCallback(
    (touchInfo: TouchInfo) => {
      lineSketcher.progressLine(touchInfo);
    },
    [lineSketcher],
  );

  const onTouchEnd = useCallback(() => {
    // currentPathRef.current = null;
  }, []);

  const touchHandler = useTouchHandler(
    {
      onStart: onTouchStart,
      onActive: onTouchProgress,
      onEnd: onTouchEnd,
    },
    [],
  );

  const onDraw = useDrawCallback((canvas, info) => {
    canvasRef.current = canvas;

    pathsRef.current.forEach(path => {
      canvasRef.current?.drawPath(path, paint.copy());
    });

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

export default memo(SketchCanvas);
