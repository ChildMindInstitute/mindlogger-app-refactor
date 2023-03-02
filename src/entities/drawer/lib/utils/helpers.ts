import { Skia, SkPath } from '@shopify/react-native-skia';

import { DrawLine } from '../types';

export const transformByWidth = (
  lines: DrawLine[],
  width: number,
): DrawLine[] => {
  const multiplier = width / 100;
  const result: DrawLine[] = [];

  for (let line of lines) {
    result.push({
      startTime: line.startTime,
      points: line.points.map(p => ({
        time: p.time,
        x: p.x * multiplier,
        y: p.y * multiplier,
      })),
    });
  }
  return result;
};

export const transformBack = (lines: DrawLine[], width: number): DrawLine[] => {
  const multiplier = width / 100;
  const result: DrawLine[] = [];

  for (let line of lines) {
    result.push({
      startTime: line.startTime,
      points: line.points.map(p => ({
        time: p.time,
        x: p.x / multiplier,
        y: p.y / multiplier,
      })),
    });
  }
  return result;
};

export const convertToSkPaths = (lines: DrawLine[]): SkPath[] => {
  const skPaths: SkPath[] = [];

  for (let line of lines) {
    if (!line.points.length) {
      continue;
    }
    const { x, y } = line.points[0];

    const path = Skia.Path.Make().moveTo(x, y);

    for (let point of line.points.slice(1)) {
      path.lineTo(point.x, point.y);
    }
    skPaths.push(path);
  }

  return skPaths;
};

export const getChunkedPointsAsStrings = (lines: DrawLine[]) => {
  const results: string[] = [];
  const chunkSize: number = 50;

  for (let line of lines) {
    const { points } = line;
    let { length } = points;

    if (length === 1) {
      const point = points[0];

      points.push({
        ...point,
        x: point.x + 1.5,
        y: point.y + 1.5,
      });
      length += 1;
    }
    for (let index = 0; index < length; index += chunkSize) {
      const myChunk = line.points.slice(index, index + chunkSize + 1);

      results.push(myChunk.map(point => `${point.x},${point.y}`).join(' '));
    }
  }
  return results;
};
