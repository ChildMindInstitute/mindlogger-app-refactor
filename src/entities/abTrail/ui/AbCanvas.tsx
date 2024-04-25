import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import {
  Skia,
  SkiaView,
  SkPath,
  TouchInfo,
  PaintStyle,
  useTouchHandler,
  useDrawCallback,
  SkCanvas,
} from '@shopify/react-native-skia';

import { AbTestPayload, Point, TestNode } from '@app/abstract/lib';
import {
  AbTestStreamEvent,
  AbTestStreamEventErrorType,
  StreamEventLoggable,
} from '@shared/lib';
import { Box, BoxProps } from '@shared/ui';

import AbShapes from './AbShapes';
import { LogLine, LogPoint, MessageType, OnResultLog } from '../lib';
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
  onResult: (data: OnResultLog) => void;
  onMessage: (message: MessageType) => void;
  onComplete: () => void;
} & StreamEventLoggable<AbTestStreamEvent> &
  BoxProps;

const AbCanvas: FC<Props> = props => {
  const [errorPath, setErrorPath] = useState<SkPath | null>(null);

  const [paths, setPaths] = useState<Array<SkPath>>([]);

  const [flareGreenPointIndex, setFlareGreenPointIndex] = useState<{
    index: number;
  } | null>(null);

  const currentPathRef = useRef<SkPath | null>();

  const currentIndexRef = useRef(1);

  const canvasRef = useRef<SkCanvas>();

  const logLines = useRef<LogLine[]>([]).current;

  const isCloseToNextRerenderedRef = useRef(false);

  const isCloseToNextRerendered = () => isCloseToNextRerenderedRef.current;

  const setCloseToNextRerendered = () =>
    (isCloseToNextRerenderedRef.current = true);

  const resetCloseToNextRerendered = () =>
    (isCloseToNextRerenderedRef.current = false);

  const {
    testData,
    onComplete,
    onMessage,
    width,
    readonly,
    onLog: onAddPointToStream,
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

  const isCloseToNode = (pointToCheck: Point, nodeIndexToCheck: number) => {
    const node = findNodeByPoint(pointToCheck, 2);
    return !!node && node.orderIndex === nodeIndexToCheck;
  };

  const isOverCurrent = (point: Point) => {
    return isOverNode(point, getCurrentIndex());
  };

  const isOverNext = (point: Point) => {
    return isOverNode(point, getCurrentIndex() + 1);
  };

  const isCloseToNext = (point: Point) => {
    return isCloseToNode(point, getCurrentIndex() + 1);
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
    canvasRef.current?.clear(Skia.Color('white'));
    reRender();
  };

  const reRender = () => {
    setPaths(x => [...x]);
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

  const getCurrentAndNextNodeLabels = () => {
    const index = getCurrentIndex();

    const currentNode = findNodeByIndex(index);
    const nextNode = findNodeByIndex(index + 1);

    return [currentNode.label, nextNode.label];
  };

  const createLogPoint = (point: Point): LogPoint => {
    const [currentNodeLabel, nextNodeLabel] = getCurrentAndNextNodeLabels();

    const logPoint: LogPoint = {
      x: point.x,
      y: point.y,
      time: new Date().getTime(),
      valid: null,
      start: currentNodeLabel,
      end: nextNodeLabel,
      actual: null,
    };
    return logPoint;
  };

  const createStreamEventPoint = (point: Point): AbTestStreamEvent => {
    const [currentNodeLabel, nextNodeLabel] = getCurrentAndNextNodeLabels();

    return {
      x: (point.x * width) / 100,
      y: (point.y * width) / 100,
      time: Date.now(),
      lineNumber: logLines?.length - 1,
      error: AbTestStreamEventErrorType.NotDefined,
      currentNodeLabel,
      nextNodeLabel,
      type: 'AbTest',
    };
  };

  const addOverCorrectPointToStream = (point: Point) => {
    const streamEventPoint = createStreamEventPoint(point);
    streamEventPoint.error = AbTestStreamEventErrorType.OverCorrectPoint;

    onAddPointToStream(streamEventPoint);
  };

  const addOverWrongPointToStream = (point: Point, wrongPointLabel: string) => {
    const streamEventPoint = createStreamEventPoint(point);
    streamEventPoint.error = AbTestStreamEventErrorType.OverWrongPoint;
    streamEventPoint.wrongPointLabel = wrongPointLabel;

    onAddPointToStream(streamEventPoint);
  };

  const addPointToStream = (point: Point) => {
    const streamEventPoint = createStreamEventPoint(point);

    onAddPointToStream(streamEventPoint);
  };

  const addOverUndefinedPointToStream = (point: Point) => {
    const streamEventPoint = createStreamEventPoint(point);
    streamEventPoint.error = AbTestStreamEventErrorType.OverUndefinedPoint;

    onAddPointToStream(streamEventPoint);
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

  const onResult = () => {
    props.onResult({
      lines: logLines,
      currentIndex: getCurrentIndex(),
      maximumIndex: testData.nodes.length,
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

  const onTouchStart = (touchInfo: TouchInfo) => {
    const isFinished = currentIndexRef.current === testData.nodes.length;

    if (currentPathRef.current || readonly || isFinished) {
      return;
    }

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    if (isOverAny(point) && !isOverCurrent(point)) {
      onMessage(MessageType.IncorrectStartPoint);
      return;
    }

    if (!isOverCurrent(point)) {
      return;
    }

    addLogLine(point);
    reCreatePath(point);
    drawPath();
    reRender();

    onAddPointToStream(createStreamEventPoint(point));
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

    if (isCloseToNext(point) && !isCloseToNextRerendered()) {
      reRender();
      setCloseToNextRerendered();
    }

    if (!isCloseToNext(point)) {
      resetCloseToNextRerendered();
    }

    if (isOverNext(point) && isOverLast(point)) {
      markLastLogPoints({ valid: true });
      addOverCorrectPointToStream(point);
      keepPathInState();
      resetCurrentPath();
      onMessage(MessageType.Completed);
      incrementCurrentIndex();
      onResult();
      onComplete();

      return;
    }

    if (isOverNext(point)) {
      markLastLogPoints({ valid: true });
      addOverCorrectPointToStream(point);
      keepPathInState();
      reCreatePath(point);
      incrementCurrentIndex();

      return;
    }

    if (isOverWrong(point)) {
      const node = findNodeByPoint(point)!;
      markLastLogPoints({ valid: false, actual: node.label });
      setErrorPath(currentPath);
      resetCurrentPath();
      setFlareGreenPointIndex({ index: getCurrentIndex() });
      onMessage(MessageType.IncorrectLine);

      addOverWrongPointToStream(point, node.label);
      onResult();
      return;
    }

    addPointToStream(point);
  };

  const onTouchEnd = (touchInfo: TouchInfo) => {
    if (!getCurrentPath()) {
      return;
    }

    resetCurrentPath();

    const point: Point = { x: touchInfo.x, y: touchInfo.y };

    const node = findNodeByPoint(point);

    if (!node) {
      setFlareGreenPointIndex({ index: getCurrentIndex() });
    }

    addOverUndefinedPointToStream(point);

    markLastLogPoints({ valid: false, actual: node?.label ?? 'none' });
    onResult();
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
    [canvasData],
  );

  const onDraw = useDrawCallback(
    (canvas, info) => {
      canvasRef.current = canvas;
      touchHandler(info.touches);
    },
    [canvasData],
  );

  return (
    <Box {...props} borderWidth={1} borderColor="$lightGrey2">
      <SkiaView onDraw={onDraw} style={styles.skiaView} />

      {canvasData && (
        <AbShapes
          paths={paths}
          lastPath={currentPathRef.current}
          testData={canvasData}
          greenRoundOrder={getGreenPointIndex()}
          errorPath={errorPath}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  skiaView: {
    height: '100%',
    width: '100%',
  },
});

export default AbCanvas;
