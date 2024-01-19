import React, { useRef, FC, useMemo } from 'react';

import { StreamEventLoggable } from '@shared/lib';
import { Box, SketchCanvas, SketchCanvasRef, useOnUndo } from '@shared/ui';

import { DrawLine, ResponseSerializer, DrawResult } from '../lib';
import DrawPoint from '../lib/utils/DrawPoint';

type Props = {
  value: Array<DrawLine>;
  onResult: (result: DrawResult) => void;
  width: number;
} & StreamEventLoggable<DrawPoint>;

const DrawingBoard: FC<Props> = props => {
  const { value, onResult, width, onLog } = props;

  const vector = width / 100;

  const sketchCanvasRef = useRef<SketchCanvasRef | null>(null);

  const callbacksRef = useRef({
    onLog,
  });

  callbacksRef.current = {
    onLog,
  };

  const initialLines: DrawPoint[][] = useMemo(() => {
    return value.map(line => {
      return line.points.map(point => {
        return new DrawPoint(point.x, point.y, point.time).scale(100 / width);
      });
    });
  }, [value, width]);

  const drawingValueLineRef = useRef<DrawLine>({
    startTime: Date.now(),
    points: [],
  });

  const onTouchStart = (x: number, y: number) => {
    const drawPoint = new DrawPoint(x, y);

    drawingValueLineRef.current = {
      startTime: Date.now(),
      points: [drawPoint],
    };

    onLog(drawPoint.scale(vector));
  };

  const onTouchProgress = (x: number, y: number) => {
    const drawPoint = new DrawPoint(x, y);

    drawingValueLineRef.current.points.push(drawPoint);

    onLog(drawPoint.scale(vector));
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
      accessibilityLabel="drawing-area"
    >
      <SketchCanvas
        ref={sketchCanvasRef}
        width={width}
        initialLines={initialLines}
        onStrokeStart={onTouchStart}
        onStrokeChanged={onTouchProgress}
        onStrokeEnd={onTouchEnd}
      />
    </Box>
  );
};

export default DrawingBoard;
