import React, { useRef, useMemo, FC } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Skia,
  SkiaView,
  TouchInfo,
  PaintStyle,
  useTouchHandler,
  useDrawCallback,
  SkCanvas,
  Canvas,
  Group,
  Path,
  SkPath,
} from '@shopify/react-native-skia';

import {
  colors,
  useShouldRestoreSkiaViewState,
  useUndoClicked,
} from '@app/shared/lib';
import { Box } from '@app/shared/ui';

import {
  convertToSkPaths,
  DrawLine,
  DrawPoint,
  Point,
  transformByWidth,
  transformBack,
  ResponseSerializer,
  DrawResult,
  CachedBezierItem,
  getBezierArray,
} from '../lib';

const paint = Skia.Paint();
paint.setColor(Skia.Color(colors.black));
paint.setStrokeWidth(1);
paint.setStyle(PaintStyle.Stroke);

type Props = {
  value: Array<DrawLine>;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
  width: number;
  isDrawingActive: boolean;
};

const DrawingBoard: FC<Props> = props => {
  const { value, onResult, onStarted, width, isDrawingActive } = props;

  const isEmpty = !value.length;

  const { undoClicked, resetUndoClicked } = useUndoClicked(isEmpty);

  const { shouldRestore, updateShouldRestore } =
    useShouldRestoreSkiaViewState();

  const canvasRef = useRef<SkCanvas>();

  const bezierCurrentCache = useRef<Array<CachedBezierItem>>([]).current;

  const pathsCache = useRef<Array<SkPath>>([]).current;

  const normalizedLines = useMemo(() => {
    return transformByWidth(value, width);
  }, [value, width]);

  const currentLogLineRef = useRef<DrawLine | null>(null);

  const paths = useMemo(() => {
    if (!normalizedLines.length) {
      pathsCache.splice(0, pathsCache.length);
    }

    const newPaths = convertToSkPaths(normalizedLines, pathsCache.length);

    pathsCache.push(...newPaths);

    return [...pathsCache];
  }, [normalizedLines, pathsCache]);

  const resetCurrentLine = () => {
    currentLogLineRef.current = null;
    canvasRef.current?.clear(Skia.Color('transparent'));
  };

  const getNow = (): number => new Date().getTime();

  const createLogPoint = (point: Point): DrawPoint => {
    return { ...point, time: getNow() };
  };

  const createLogLine = ({ x, y }: Point): void => {
    currentLogLineRef.current = {
      startTime: getNow(),
      points: [{ time: getNow(), x, y }],
    };
  };

  const addLogPoint = (point: DrawPoint) => {
    getLogLine()!.points.push(point);
  };

  const getLogLine = (): DrawLine | null => {
    return currentLogLineRef.current;
  };

  const onTouchStart = (touchInfo: TouchInfo) => {
    bezierCurrentCache.splice(0, bezierCurrentCache.length);

    resetCurrentLine();

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    createLogLine(point);
    drawPath();
    onStarted();
  };

  const onTouchProgress = (touchInfo: TouchInfo) => {
    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    addLogPoint(createLogPoint(point));
    drawPath();
  };

  const onTouchEnd = () => {
    if (!currentLogLineRef.current) {
      return;
    }

    const transformedLine = transformBack(currentLogLineRef.current, width);

    const lines = [...value, transformedLine];

    const svgString = ResponseSerializer.process(lines);

    const result: DrawResult = {
      lines,
      svgString,
      width,
    };

    onResult(result);
  };

  const drawPath = () => {
    const originalPoints = getLogLine()?.points;
    if (!originalPoints) {
      return;
    }

    const bezierPoints = getBezierArray(originalPoints, bezierCurrentCache);

    const path = Skia.Path.Make().moveTo(bezierPoints[0].x, bezierPoints[0].y);

    for (let i = 1; i < bezierPoints.length; i++) {
      const point = bezierPoints[i];
      path.lineTo(point.x, point.y);
    }

    canvasRef.current?.drawPath(path, paint.copy());
  };

  const touchHandler = useTouchHandler(
    {
      onStart: onTouchStart,
      onActive: onTouchProgress,
      onEnd: onTouchEnd,
    },
    [width, value],
  );

  const onDraw = useDrawCallback(
    (canvas, info) => {
      canvasRef.current = canvas;

      touchHandler(info.touches);

      if (undoClicked()) {
        resetCurrentLine();
        resetUndoClicked();
        return;
      }

      if (shouldRestore()) {
        drawPath();
        updateShouldRestore();
      }
    },
    [width, touchHandler],
  );

  return (
    <Box
      width={width}
      height={width}
      zIndex={1}
      borderWidth={1}
      borderColor="$lightGrey2"
      disabled={!isDrawingActive}
    >
      <SkiaView onDraw={onDraw} style={styles.skiaView} />

      <View style={styles.canvasView} pointerEvents="none">
        <Canvas style={styles.canvas}>
          <Group>
            {paths.map((path, i) => (
              <Group>
                <Path key={i} path={path} strokeWidth={1} style="stroke" />
              </Group>
            ))}
          </Group>
        </Canvas>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  skiaView: {
    height: '100%',
    width: '100%',
  },
  canvasView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  canvas: {
    height: '100%',
    width: '100%',
  },
});

export default DrawingBoard;
