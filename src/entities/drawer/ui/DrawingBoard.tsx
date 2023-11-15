import React, { useRef, FC, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Skia, PaintStyle } from '@shopify/react-native-skia';
import { SketchCanvas } from '@sourcetoad/react-native-sketch-canvas';

import { colors, StreamEventLoggable } from '@shared/lib';
import { Box, useOnUndo } from '@shared/ui';

import { DrawLine, ResponseSerializer, DrawResult, LinesTracker } from '../lib';
import DrawPoint from '../lib/utils/DrawPoint';

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

  const vector = width / 100;

  const callbacksRef = useRef({
    onStarted,
    onLog,
  });

  callbacksRef.current = {
    onStarted,
    onLog,
  };

  const canvasRef = useRef<SketchCanvas | null>();

  const linesRef = useRef<Array<DrawLine>>(value);

  const lineTracker = useMemo(() => {
    return new LinesTracker(linesRef, {
      onPointAdded: point => {
        callbacksRef.current.onLog(point.scale(vector));
      },
    });
  }, [vector]);

  const onStrokeStart = useCallback(
    (x: number, y: number) => {
      lineTracker.createLine(x, y);
    },
    [lineTracker],
  );

  const onStrokeChanged = useCallback(
    (x: number, y: number) => {
      lineTracker.progressLine(x, y);
    },
    [lineTracker],
  );

  const onStrokeEnd = useCallback(() => {
    const lines = linesRef.current;

    const svgString = ResponseSerializer.process(lines, width);

    const result: DrawResult = {
      lines,
      svgString,
      width,
    } as DrawResult;

    onResult(result);
  }, [onResult, width]);

  const initializeDrawing = useCallback(
    (canvas: SketchCanvas) => {
      const paths = LinesTracker.fromDrawLines(linesRef.current, width);

      paths.forEach(path => {
        canvas.addPath(path);
      });
    },
    [width],
  );

  const onRefReceived = useCallback(
    (ref: SketchCanvas | null) => {
      canvasRef.current = ref;

      if (canvasRef.current) {
        initializeDrawing(canvasRef.current);
      }
    },
    [initializeDrawing],
  );

  useOnUndo(() => {
    canvasRef.current?.clear();
    linesRef.current = [];
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
        <SketchCanvas
          ref={onRefReceived}
          style={styles.canvasView}
          strokeColor={'black'}
          strokeWidth={1.5}
          onStrokeStart={onStrokeStart}
          onStrokeChanged={onStrokeChanged}
          onStrokeEnd={onStrokeEnd}
        />
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
