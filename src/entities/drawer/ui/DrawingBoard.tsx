import React, { useRef, FC, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Skia,
  TouchInfo,
  PaintStyle,
  useTouchHandler,
  Canvas,
  Group,
  Path,
  SkPath,
} from '@shopify/react-native-skia';

import { colors, StreamEventLoggable } from '@shared/lib';
import { Box, useOnUndo } from '@shared/ui';

import {
  DrawLine,
  DrawPoint,
  ResponseSerializer,
  DrawResult,
  LineSketcher,
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

  const callbacksRef = useRef({
    onStarted,
    onLog,
  });

  callbacksRef.current = {
    onStarted,
    onLog,
  };

  const drawingValueLineRef = useRef<DrawLine>({
    startTime: Date.now(),
    points: [],
  });

  const [paths, setPaths] = useState<SkPath[]>(() =>
    LineSketcher.fromDrawLines(value),
  );

  const lineSketcher = useMemo(
    () =>
      new LineSketcher(drawingValueLineRef, {
        onPointAdded: point => {
          const vector = width / 100;

          callbacksRef.current.onLog(point.scale(vector));
        },
      }),
    [width],
  );

  const onTouchStart = useCallback(
    (touchInfo: TouchInfo) => {
      setPaths(currentPaths => {
        const newPath = lineSketcher.createLine(touchInfo);

        return [...currentPaths, newPath];
      });

      callbacksRef.current.onStarted();
    },
    [lineSketcher],
  );

  const onTouchProgress = useCallback(
    (touchInfo: TouchInfo) => {
      setPaths(currentPaths => {
        return lineSketcher.progressLine(touchInfo, currentPaths);
      });
    },
    [lineSketcher],
  );

  const onTouchEnd = useCallback(() => {
    const newLine = { ...drawingValueLineRef.current };

    const lines = [...value, newLine];

    const svgString = ResponseSerializer.process(lines, width);

    const result: DrawResult = {
      lines,
      svgString,
      width,
    } as DrawResult;

    onResult(result);
  }, [onResult, value, width]);

  const touchHandler = useTouchHandler(
    {
      onStart: onTouchStart,
      onActive: onTouchProgress,
      onEnd: onTouchEnd,
    },
    [width, value],
  );

  useOnUndo(() => {
    setPaths([]);

    drawingValueLineRef.current = {
      startTime: Date.now(),
      points: [],
    };
  });

  return (
    <Box
      width={width}
      height={width}
      zIndex={1}
      borderWidth={1}
      borderColor="$lightGrey2"
      pointerEvents={isDrawingActive ? 'auto' : 'none'}
    >
      <View style={styles.canvasView}>
        <Canvas style={styles.canvas} onTouch={touchHandler}>
          <Group>
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
