import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { PaintStyle, Skia, SkPath } from '@shopify/react-native-skia';

import { AbTestPayload, Point, TestNode } from '@app/abstract/lib';
import { StreamEventLoggable } from '@shared/lib';
import { Box, BoxProps, SketchCanvas, SketchCanvasRef } from '@shared/ui';

import AbShapes from './AbShapes';
import {
  LogLine,
  LogPoint,
  MessageType,
  OnResultLog,
  StreamEventPoint,
} from '../lib';
import { getDistance, transformCoordinates } from '../lib/utils';

const paint = Skia.Paint();
paint.setColor(Skia.Color('black'));
paint.setStrokeWidth(1);
paint.setStyle(PaintStyle.Stroke);

const ErrorLineTimeout = 1000;
const FlareGreenPointTimeout = 1000;

type Props = {
  testData: AbTestPayload;
  readonly: boolean;
  width: number;
  onLogResult: (data: OnResultLog) => void;
  onMessage: (message: MessageType) => void;
  onComplete: () => void;
} & StreamEventLoggable<StreamEventPoint> &
  BoxProps;

const AbCanvas: FC<Props> = props => {
  const [errorPath, setErrorPath] = useState<SkPath | null>(null);

  const [paths, setPaths] = useState<Array<SkPath>>([]);

  const [flareGreenPointIndex, setFlareGreenPointIndex] = useState<{
    index: number;
  } | null>(null);

  const currentPathRef = useRef<SkPath | null>();

  const currentIndexRef = useRef(1);

  const sketchCanvasRef = useRef<SketchCanvasRef | null>(null);

  const logLines = useRef<LogLine[]>([]).current;

  const {
    testData,
    onLogResult,
    onComplete,
    onMessage,
    width,
    readonly,
    onLog,
  } = props;

  const canvasData = useMemo(
    () => (width ? transformCoordinates(testData, width) : null),
    [width, testData],
  );

  useEffect(() => {
    if (!errorPath) {
      return;
    }
    const id = setTimeout(() => {
      setErrorPath(null);
    }, ErrorLineTimeout);

    return () => {
      clearTimeout(id);
    };
  }, [errorPath]);

  useEffect(() => {
    if (flareGreenPointIndex === null) {
      return;
    }
    const id = setTimeout(() => {
      setFlareGreenPointIndex(null);
    }, FlareGreenPointTimeout);

    return () => {
      clearTimeout(id);
    };
  }, [flareGreenPointIndex]);

  const getCurrentPath = (): SkPath => currentPathRef.current!;

  const getCurrentIndex = () => currentIndexRef.current;

  const incrementCurrentIndex = () => {
    currentIndexRef.current++;
  };

  const keepPathInState = () => {
    const path = getCurrentPath();
    if (path) {
      setPaths(list => [...list, path]);
    }
  };

  const isOverNode = (pointToCheck: Point, nodeIndexToCheck: number) => {
    const node = findNodeByPoint(pointToCheck);
    return !!node && node.orderIndex === nodeIndexToCheck;
  };

  const isOverCurrent = (point: Point) => {
    return isOverNode(point, getCurrentIndex());
  };

  const isOverNext = (point: Point) => {
    return isOverNode(point, getCurrentIndex() + 1);
  };

  const isOverLast = (point: Point) => {
    const totalNodes = canvasData!.nodes.length;
    const lastNode = canvasData!.nodes[totalNodes - 1];
    return isOverNode(point, lastNode.orderIndex);
  };

  const isOverAny = (point: Point) => {
    const foundNode = findNodeByPoint(point);
    return !!foundNode;
  };

  const isOverWrong = (point: Point) => {
    return !isOverCurrent(point) && !isOverNext(point) && isOverAny(point);
  };

  const resetCurrentPath = () => {
    currentPathRef.current = null;

    sketchCanvasRef?.current?.clear();
  };

  const reCreatePath = (point: Point) => {
    currentPathRef.current = Skia.Path.Make().moveTo(point.x, point.y);
  };

  const findNodeByIndex = (index: number) =>
    canvasData!.nodes.find(x => x.orderIndex === index)!;

  const findNodeByPoint = (
    point: Point,
    radiusMultiplier = 1,
  ): TestNode | null => {
    const foundNode = canvasData?.nodes.find(node => {
      const distance = getDistance(
        { x: node.cx, y: node.cy },
        { x: point.x, y: point.y },
      );
      return distance < canvasData.config.radius * radiusMultiplier;
    });
    return foundNode ?? null;
  };

  const createLogPoint = (point: Point): LogPoint => {
    const index = getCurrentIndex();

    const currentNode = findNodeByIndex(index);
    const nextNode = findNodeByIndex(index + 1);

    const logPoint: LogPoint = {
      x: point.x,
      y: point.y,
      time: new Date().getTime(),
      valid: null,
      start: currentNode.label,
      end: nextNode.label,
      actual: null,
    };
    return logPoint;
  };

  const addLogLine = ({ x, y }: Point): void => {
    const newLine: LogLine = {
      points: [createLogPoint({ x, y })],
    };
    logLines.push(newLine);
  };

  const addLogPoint = (point: LogPoint) => {
    getLastLogLine().points.push(point);
  };

  const getLastLogLine = () => {
    return logLines[logLines.length - 1];
  };

  const markLastLogPoints = (mark: {
    valid: boolean;
    actual?: string | null;
  }) => {
    getLastLogLine().points.forEach(x => {
      if (x.valid === null) {
        x.valid = mark.valid;
        x.actual = mark.actual ?? null;
      }
    });
  };

  const getGreenPointIndex = () => {
    const started = !!logLines.length;

    let greenPointIndex: number | null = null;
    if (!started) {
      greenPointIndex = 1;
    } else if (flareGreenPointIndex) {
      greenPointIndex = flareGreenPointIndex.index;
    }
    return greenPointIndex;
  };

  const onTouchStart = (x: number, y: number, time: number) => {
    const isFinished = paths.length === currentIndexRef.current;

    if (currentPathRef.current || readonly || isFinished) {
      resetCurrentPath();
      return;
    }

    const point: Point = { x, y };

    if (isOverAny(point) && !isOverCurrent(point)) {
      onMessage(MessageType.IncorrectStartPoint);
      resetCurrentPath();
      return;
    }

    if (!isOverCurrent(point)) {
      resetCurrentPath();
      return;
    }

    addLogLine(point);
    reCreatePath(point);

    onLog({
      x: (x * width) / 100,
      y: (y * width) / 100,
      time: time,
    });
  };

  const onTouchProgress = (x: number, y: number, time: number) => {
    const currentPath = getCurrentPath();

    if (errorPath) {
      resetCurrentPath();
      return;
    }

    if (!currentPath) {
      return;
    }

    const point: Point = { x, y };

    currentPath.lineTo(point.x, point.y);

    addLogPoint(createLogPoint(point));

    onLog({
      x: (x * width) / 100,
      y: (y * width) / 100,
      time: time,
    });

    if (isOverNext(point) && isOverLast(point)) {
      markLastLogPoints({ valid: true });
      keepPathInState();
      resetCurrentPath();
      onLogResult({
        lines: logLines,
        currentIndex: getCurrentIndex() + 1,
      });
      onMessage(MessageType.Completed);
      onComplete();
      return;
    }

    if (isOverNext(point)) {
      markLastLogPoints({ valid: true });
      keepPathInState();
      reCreatePath(point);
      incrementCurrentIndex();
      return;
    }

    if (isOverWrong(point)) {
      const node = findNodeByPoint(point)!;
      markLastLogPoints({ valid: false, actual: node.label });
      setFlareGreenPointIndex({ index: getCurrentIndex() });
      onMessage(MessageType.IncorrectLine);
      setErrorPath(currentPath);
    }
  };

  const onTouchEnd = (x: number, y: number) => {
    if (!getCurrentPath()) {
      return;
    }

    resetCurrentPath();
    const point: Point = { x, y };

    const node = findNodeByPoint(point);

    if (!node) {
      setFlareGreenPointIndex({ index: getCurrentIndex() });
    }

    markLastLogPoints({ valid: false, actual: node?.label ?? 'none' });
  };

  return (
    <Box {...props} borderWidth={1} borderColor="$lightGrey2">
      <SketchCanvas
        ref={sketchCanvasRef}
        width={width}
        initialLines={[]}
        onStrokeStart={onTouchStart}
        onStrokeChanged={onTouchProgress}
        onStrokeEnd={onTouchEnd}
      />

      {canvasData && (
        <AbShapes
          paths={paths}
          testData={canvasData}
          greenRoundOrder={getGreenPointIndex()}
          errorPath={errorPath}
        />
      )}
    </Box>
  );
};

export default AbCanvas;
