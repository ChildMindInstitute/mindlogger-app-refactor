import { MutableRefObject } from 'react';

import { Skia, SkPath } from '@shopify/react-native-skia';

import DrawPoint from './DrawPoint';
import { DrawLine, Point } from '../types';

type OnPointAddedCallback = (point: DrawPoint) => void;
type LineRef = MutableRefObject<DrawLine>;

type Callbacks = {
  onPointAdded: OnPointAddedCallback;
};

class LineSketcher {
  private lineRef: LineRef;
  private onPointAdded: OnPointAddedCallback;

  constructor(lineRef: LineRef, callbacks: Callbacks) {
    this.lineRef = lineRef;

    this.onPointAdded = callbacks.onPointAdded;
  }

  static fromDrawLines(lines: DrawLine[]) {
    const skPaths: SkPath[] = [];

    for (let line of lines) {
      if (!line.points.length) {
        continue;
      }

      const [firstPoint, ...restPoints] = line.points;

      const { x, y } = firstPoint;

      const path = Skia.Path.Make().moveTo(x, y);

      for (let point of restPoints) {
        const lastPoint = path.getLastPt();
        const xMid = (lastPoint.x + point.x) / 2;
        const yMid = (lastPoint.y + point.y) / 2;

        path.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
      }

      skPaths.push(path);
    }

    return skPaths;
  }

  createLine(fromPoint: Point) {
    const { x, y } = fromPoint;
    const newPath = Skia.Path.Make();

    newPath.moveTo(x, y);

    const drawPoint = new DrawPoint(x, y);

    this.lineRef.current = {
      startTime: Date.now(),
      points: [drawPoint],
    };

    this.onPointAdded(drawPoint);

    return newPath;
  }

  progressLine(fromPoint: Point, paths: SkPath[]) {
    const { x, y } = fromPoint;
    const currentPath = paths[paths.length - 1];
    const lastPoint = currentPath.getLastPt();
    const xMid = (lastPoint.x + x) / 2;
    const yMid = (lastPoint.y + y) / 2;

    currentPath.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);

    const result = [...paths.slice(0, paths.length - 1), currentPath];

    const drawPoint = new DrawPoint(x, y);

    this.lineRef.current.points.push(drawPoint);

    this.onPointAdded(drawPoint);

    return result;
  }
}

export default LineSketcher;
