/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, FC, useCallback } from 'react';

import { Skia, TouchInfo, PaintStyle } from '@shopify/react-native-skia';

import { colors, StreamEventLoggable } from '@shared/lib';
import { Box, SketchCanvas, SketchCanvasRef, useOnUndo } from '@shared/ui';

import { DrawLine, ResponseSerializer, DrawResult } from '../lib';
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

  const sketchCanvasRef = useRef<SketchCanvasRef | null>(null);

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

  const onTouchStart = (x: number, y: number) => {
    const drawPoint = new DrawPoint(x, y).scale(vector);

    drawingValueLineRef.current = {
      startTime: Date.now(),
      points: [drawPoint],
    };

    onLog(drawPoint);
  };

  const onTouchProgress = (x: number, y: number) => {
    const drawPoint = new DrawPoint(x, y).scale(vector);

    drawingValueLineRef.current.points.push(drawPoint);

    onLog(drawPoint);
  };

  const onTouchEnd = () => {
    const newLine = drawingValueLineRef.current;

    const lines = [...value, newLine];

    const svgString = ResponseSerializer.process(lines, width);

    const result: DrawResult = {
      lines,
      svgString,
      width,
    } as DrawResult;

    onResult(result);
  };

  useOnUndo(() => {
    sketchCanvasRef.current?.clear();
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
      <SketchCanvas
        ref={sketchCanvasRef}
        width={width}
        onStrokeStart={onTouchStart}
        onStrokeChanged={onTouchProgress}
        onStrokeEnd={onTouchEnd}
      />
    </Box>
  );
};

export default DrawingBoard;
