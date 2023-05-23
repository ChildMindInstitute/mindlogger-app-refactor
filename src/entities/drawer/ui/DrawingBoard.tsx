import React, { useRef, useMemo, FC } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Skia,
  SkiaView,
  SkPath,
  TouchInfo,
  PaintStyle,
  useTouchHandler,
  useDrawCallback,
  SkCanvas,
  Canvas,
  Group,
  Path,
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
};

const DrawingBoard: FC<Props> = props => {
  const { value, onResult, onStarted, width } = props;

  const isEmpty = !value.length;

  const { undoClicked, resetUndoClicked } = useUndoClicked(isEmpty);

  const { shouldRestore, updateShouldRestore } =
    useShouldRestoreSkiaViewState();

  const currentPathRef = useRef<SkPath | null>();

  const canvasRef = useRef<SkCanvas>();

  const normalizedLines = useMemo(() => {
    return transformByWidth(value, width);
  }, [value, width]);

  const currentLogLineRef = useRef<DrawLine | null>(null);

  const paths = useMemo(
    () => convertToSkPaths(normalizedLines),
    [normalizedLines],
  );

  const getCurrentPath = (): SkPath => currentPathRef.current!;

  const resetCurrentPath = () => {
    currentPathRef.current = null;
    currentLogLineRef.current = null;
    canvasRef.current?.clear(Skia.Color('transparent'));
  };

  const reCreatePath = (point: Point) => {
    currentPathRef.current = Skia.Path.Make().moveTo(point.x, point.y);
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
    resetCurrentPath();

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    createLogLine(point);
    reCreatePath(point);
    drawPath();
    onStarted();
  };

  const onTouchProgress = (touchInfo: TouchInfo) => {
    const currentPath = getCurrentPath();

    if (!currentPath) {
      return;
    }

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    currentPath.lineTo(point.x, point.y);
    addLogPoint(createLogPoint(point));
    drawPath();
  };

  const onTouchEnd = () => {
    if (!getCurrentPath() || !currentLogLineRef.current) {
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
    if (!currentPathRef.current) {
      return;
    }
    canvasRef.current?.drawPath(currentPathRef.current, paint.copy());
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
        resetCurrentPath();
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

  const SkiaViewMemoized = useMemo(() => {
    return <SkiaView onDraw={onDraw} style={styles.skiaView} />;
  }, [onDraw]);

  return (
    <Box
      width={width}
      height={width}
      zIndex={1}
      borderWidth={1}
      borderColor="$lightGrey2"
    >
      {SkiaViewMemoized}

      <View style={styles.canvasView} pointerEvents="none">
        <Canvas style={styles.canvas}>
          {!!paths && (
            <Group>
              {paths.map((path, i) => (
                <Path key={i} path={path} strokeWidth={1} style="stroke" />
              ))}
            </Group>
          )}
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
