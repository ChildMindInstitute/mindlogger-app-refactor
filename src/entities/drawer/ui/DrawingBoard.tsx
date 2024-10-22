import React, { useRef, FC, useMemo } from 'react';

import {
  DrawingStreamEvent,
  StreamEventLoggable,
} from '@app/shared/lib/tcp/types';
import { Box } from '@app/shared/ui/base';
import {
  SketchCanvas,
  SketchCanvasRef,
} from '@app/shared/ui/SketchCanvas/SketchCanvas';
import { useOnUndo } from '@app/shared/ui/Stepper/useOnUndo';

import { DrawLine, DrawResult } from '../lib/types/draw';
import { DrawPoint } from '../lib/utils/DrawPoint';
import { getDefaultResponseSerializer } from '../lib/utils/responseSerializerInstance';

type Props = {
  value: Array<DrawLine>;
  onResult: (result: DrawResult) => void;
  width: number;
} & StreamEventLoggable<DrawingStreamEvent>;

export const DrawingBoard: FC<Props> = props => {
  const { value, onResult, width, onLog } = props;

  const vector = width / 100;
  const borderWidth = 1;

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
        return new DrawPoint(point.x, point.y, point.time);
      });
    });
  }, [value]);

  const drawingValueLineRef = useRef<DrawLine>({
    startTime: Date.now(),
    points: [],
  });

  const onTouchStart = (x: number, y: number, time: number) => {
    const drawPoint = new DrawPoint(x, y, time);

    drawingValueLineRef.current = {
      startTime: Date.now(),
      points: [drawPoint],
    };
    const logPoint = drawPoint.scale(vector);

    onLog({ ...logPoint, lineNumber: value?.length, type: 'DrawingTest' });
  };

  const onTouchProgress = (x: number, y: number, time: number) => {
    const drawPoint = new DrawPoint(x, y, time);

    drawingValueLineRef.current.points.push(drawPoint);

    const logPoint = drawPoint.scale(vector);

    onLog({ ...logPoint, lineNumber: value?.length, type: 'DrawingTest' });
  };

  const onTouchEnd = () => {
    const newLine = drawingValueLineRef.current;

    const lines = [...value, newLine];

    const svgString = getDefaultResponseSerializer().process(lines, width);

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
      flex={1}
      zIndex={1}
      maxWidth={width}
      borderWidth={borderWidth}
      borderColor="$lightGrey2"
      accessibilityLabel="drawing-area"
    >
      <SketchCanvas
        ref={sketchCanvasRef}
        initialLines={initialLines}
        onStrokeStart={onTouchStart}
        onStrokeChanged={onTouchProgress}
        onStrokeEnd={onTouchEnd}
      />
    </Box>
  );
};
