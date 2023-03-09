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

import { Box, BoxProps } from '@app/shared/ui';

import AbShapes from './AbShapes';
import {
  DeviceType,
  LogLine,
  LogPoint,
  MessageType,
  OnResultLog,
  Point,
  TestNode,
  TestScreenPayload,
} from '../lib';
import { getDistance, transformCoordinates } from '../lib/utils';

const paint = Skia.Paint();
paint.setColor(Skia.Color('black'));
paint.setStrokeWidth(1);
paint.setStyle(PaintStyle.Stroke);

const ErrorLineTimeout = 1000;
const FlareGreenPointTimeout = 1000;

type Props = {
  testData: TestScreenPayload;
  deviceType: DeviceType;
  readonly: boolean;
  width: number;
  onLogResult: (data: OnResultLog) => void;
  onMessage: (message: MessageType) => void;
  onComplete: () => void;
} & BoxProps;

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

  const {
    testData,
    deviceType,
    onLogResult,
    onMessage,
    onComplete,
    width,
    readonly,
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

  const findNodeByPoint = (point: Point): TestNode | null => {
    const foundNode = canvasData?.nodes.find(node => {
      const distance = getDistance(
        { x: node.cx, y: node.cy },
        { x: point.x, y: point.y },
      );
      return distance < canvasData.config.radius;
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

  const onTouchStart = (touchInfo: TouchInfo) => {
    if (currentPathRef.current || readonly) {
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
      setErrorPath(currentPath);
      resetCurrentPath();
      setFlareGreenPointIndex({ index: getCurrentIndex() });
      onLogResult({
        lines: logLines,
        currentIndex: getCurrentIndex(),
      });
      onMessage(MessageType.IncorrectLine);
    }
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

    markLastLogPoints({ valid: false, actual: node?.label ?? 'none' });

    onLogResult({
      lines: logLines,
      currentIndex: getCurrentIndex(),
    });
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
          testData={canvasData}
          deviceType={deviceType}
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
