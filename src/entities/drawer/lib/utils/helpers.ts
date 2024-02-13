import { Skia, SkPath } from '@shopify/react-native-skia';

import { getBezierArray } from './bezier';
import { DrawLine, Point } from '../types';

export const convertToSkPaths = (
  lines: DrawLine[],
  startFrom: number,
): SkPath[] => {
  const skPaths: SkPath[] = [];

  for (const line of lines.slice(startFrom)) {
    if (!line.points.length) {
      continue;
    }

    const curvePoints: Point[] = getBezierArray(line.points, []);

    const { x, y } = curvePoints[0];

    const path = Skia.Path.Make().moveTo(x, y);

    for (const point of curvePoints.slice(1)) {
      path.lineTo(point.x, point.y);
    }
    skPaths.push(path);
  }

  return skPaths;
};

export const getChunkedPointsAsStrings = (lines: DrawLine[]) => {
  const results: string[] = [];
  const chunkSize: number = 50;

  for (const line of lines) {
    const { points } = line;
    const { length } = points;

    for (let index = 0; index < length; index += chunkSize) {
      const myChunk = line.points.slice(index, index + chunkSize + 1);

      results.push(myChunk.map((point) => `${point.x},${point.y}`).join(' '));
    }
  }
  return results;
};
