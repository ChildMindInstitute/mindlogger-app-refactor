/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useRef, useState, useMemo } from 'react';
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

import { colors } from '@app/shared/lib';
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
  initialLines: Array<DrawLine>;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
  width: number;
};

const DrawingBoard: FC<Props> = props => {
  const { initialLines, onResult, onStarted, width } = props;

  const currentPathRef = useRef<SkPath | null>();

  const canvasRef = useRef<SkCanvas>();

  const initialLogLines = useMemo(() => {
    return transformByWidth(initialLines, width);
  }, []);

  const logLines = useRef<Array<DrawLine>>(initialLogLines).current;

  const [paths, setPaths] = useState<Array<SkPath>>(() => {
    return convertToSkPaths(initialLogLines);
  });

  const getCurrentPath = (): SkPath => currentPathRef.current!;

  const keepPathInState = () => {
    const path = getCurrentPath();
    if (path) {
      setPaths(list => [...list, path]);
    }
  };

  const resetCurrentPath = () => {
    currentPathRef.current = null;
    canvasRef.current?.clear(Skia.Color('transparent'));
    reRender();
  };

  const reRender = () => {
    setPaths(x => [...x]);
  };

  const reCreatePath = (point: Point) => {
    currentPathRef.current = Skia.Path.Make().moveTo(point.x, point.y);
  };

  const getNow = (): number => new Date().getTime();

  const createLogPoint = (point: Point): DrawPoint => {
    return { ...point, time: getNow() };
  };

  const addLogLine = ({ x, y }: Point): void => {
    logLines.push({
      startTime: getNow(),
      points: [{ time: getNow(), x, y }],
    });
  };

  const addLogPoint = (point: DrawPoint) => {
    getLastLogLine()!.points.push(point);
  };

  const getLastLogLine = (): DrawLine | null => {
    if (!logLines.length) {
      return null;
    }
    return logLines[logLines.length - 1];
  };

  const onTouchStart = (touchInfo: TouchInfo) => {
    if (currentPathRef.current) {
      return;
    }

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    addLogLine(point);
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
    if (!getCurrentPath()) {
      return;
    }

    const transformedLines = transformBack(logLines, width!);

    const svgString = ResponseSerializer.process(transformedLines);

    const result: DrawResult = {
      lines: logLines,
      svgString,
      width: width!,
    };

    keepPathInState();
    resetCurrentPath();
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
    [width],
  );

  const onDraw = useDrawCallback(
    (canvas, info) => {
      canvasRef.current = canvas;
      touchHandler(info.touches);
    },
    [width],
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
