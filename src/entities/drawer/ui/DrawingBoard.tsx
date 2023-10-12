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
  useUndoClicked,
  StreamEventLoggable,
  useForceUpdate,
} from '@shared/lib';
import { Box } from '@shared/ui';

import {
  convertToSkPaths,
  DrawLine,
  DrawPoint,
  Point,
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
} & StreamEventLoggable<DrawPoint>;

const DrawingBoard: FC<Props> = props => {
  const { value, onResult, onStarted, width, isDrawingActive, onLog } = props;

  const reRender = useForceUpdate();

  const { undoClicked, resetUndoClicked } = useUndoClicked(!value.length);

  const canvasRef = useRef<SkCanvas>();

  const bezierCache = useRef<Array<CachedBezierItem>>([]).current;

  const pathsCache = useRef<Array<SkPath>>([]).current;

  const drawingValueLineRef = useRef<DrawLine | null>(null);

  const drawingPathRef = useRef<SkPath | null>(null);

  const updateDrawingPath = (path: SkPath) => (drawingPathRef.current = path);

  const paths = useMemo(() => {
    if (!value.length) {
      pathsCache.splice(0, pathsCache.length);
    }

    const newPaths = convertToSkPaths([...value], pathsCache.length);

    pathsCache.push(...newPaths);

    return [...pathsCache];
  }, [value, pathsCache]);

  const resetCurrentLine = () => {
    drawingValueLineRef.current = null;
    drawingPathRef.current = null;
    canvasRef.current?.clear(Skia.Color('transparent'));
  };

  const getNow = (): number => new Date().getTime();

  const createValuePoint = (point: Point): DrawPoint => {
    const logPoint = { ...point, time: getNow() };

    onLog(logPoint);

    return logPoint;
  };

  const createValueLine = ({ x, y }: Point): void => {
    const logPoint = { x, y, time: getNow() };

    onLog(logPoint);

    drawingValueLineRef.current = {
      startTime: getNow(),
      points: [logPoint],
    };
  };

  const addValuePoint = (point: DrawPoint) => {
    getValueLine()!.points.push(point);
  };

  const getValueLine = (): DrawLine | null => {
    return drawingValueLineRef.current;
  };

  const isEqualToLastPoint = (point: Point): boolean => {
    const line = getValueLine()!;

    if (!line.points.length) {
      return false;
    }

    const lastPoint: DrawPoint = line.points.slice(-1)[0];

    return (
      Math.round(point.x) === Math.round(lastPoint.x) &&
      Math.round(point.y) === Math.round(lastPoint.y)
    );
  };

  const onTouchStart = (touchInfo: TouchInfo) => {
    bezierCache.splice(0, bezierCache.length);

    resetCurrentLine();

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    createValueLine(point);
    drawPath();
    onStarted();
  };

  const onTouchProgress = (touchInfo: TouchInfo) => {
    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    if (isEqualToLastPoint(point)) {
      drawPath();
      return;
    }

    addValuePoint(createValuePoint(point));
    drawPath();
  };

  const onTouchEnd = () => {
    if (!drawingValueLineRef.current) {
      return;
    }

    const newLine = { ...drawingValueLineRef.current };

    const lines = [...value, newLine];

    const svgString = ResponseSerializer.process(lines, width);

    const result: DrawResult = {
      lines,
      svgString,
      width,
    } as DrawResult;

    reRender();

    onResult(result);
  };

  const drawPath = () => {
    const originalPoints = getValueLine()?.points;
    if (!originalPoints) {
      return;
    }

    const bezierPoints = getBezierArray(originalPoints, bezierCache);

    const path = Skia.Path.Make();

    updateDrawingPath(path);

    path.addPoly(bezierPoints, false);

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
      if (!isDrawingActive) {
        return;
      }

      canvasRef.current = canvas;

      touchHandler(info.touches);

      if (undoClicked()) {
        resetCurrentLine();
        resetUndoClicked();
        return;
      }
    },
    [width, touchHandler, isDrawingActive],
  );

  return (
    <Box
      width={width}
      height={width}
      zIndex={1}
      borderWidth={1}
      borderColor="$lightGrey2"
    >
      <SkiaView onDraw={onDraw} style={styles.skiaView} />

      <View style={styles.canvasView} pointerEvents="none">
        <Canvas style={styles.canvas}>
          <Group>
            <Group>
              {!!drawingPathRef.current && (
                <Path
                  path={drawingPathRef.current}
                  strokeWidth={1}
                  style="stroke"
                />
              )}
            </Group>

            {paths.map((path, i) => (
              <Group key={i}>
                <Path path={path} strokeWidth={1} style="stroke" />
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
