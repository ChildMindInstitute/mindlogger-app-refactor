/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, FC, useCallback } from 'react';

import { Skia, TouchInfo, PaintStyle } from '@shopify/react-native-skia';

import { colors, StreamEventLoggable } from '@shared/lib';
import { Box, SketchCanvas, SketchCanvasRef, useOnUndo } from '@shared/ui';

import { DrawLine, DrawPoint, ResponseSerializer, DrawResult } from '../lib';

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

  const onTouchStart = useCallback((touchInfo: TouchInfo) => {}, []);

  const onTouchProgress = useCallback((touchInfo: TouchInfo) => {}, []);

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
      <SketchCanvas ref={sketchCanvasRef} width={width} />
    </Box>
  );
};

export default DrawingBoard;
