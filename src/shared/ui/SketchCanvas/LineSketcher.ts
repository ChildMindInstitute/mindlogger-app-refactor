import { PaintStyle, Skia, SkPath } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

import { palette } from '@app/shared/lib/constants/palette';

export type Point = {
  x: number;
  y: number;
};

export const enum Shape {
  Dot = 'dot',
  Line = 'line',
}
const paint = Skia.Paint();

paint.setColor(Skia.Color(palette.black));
paint.setStrokeWidth(1.5);
paint.setStyle(PaintStyle.Stroke);

export function shouldCreateNewLine(points: SharedValue<Point[]>): boolean {
  'worklet';
  const pointsCount = points.value.length;
  const suggestedMaxPointsPerLine = 100;

  return pointsCount % suggestedMaxPointsPerLine === 0;
}

export function createLine(
  points: SharedValue<Point[]>,
  point: Point,
  startFromPoint: Point = point,
): SkPath {
  'worklet';
  points.value = [point];

  const newPath = Skia.Path.Make();

  newPath.moveTo(startFromPoint.x, startFromPoint.y);
  newPath.lineTo(point.x, point.y);

  return newPath;
}

function addPointToPath(
  path: SkPath | undefined,
  tPoint: Point,
  pPoint: Point,
  point: Point,
): void {
  'worklet';
  if (!path) {
    return;
  }

  const mid1: Point = {
    x: (pPoint.x + tPoint.x) / 2,
    y: (pPoint.y + tPoint.y) / 2,
  };
  const mid2: Point = {
    x: (point.x + pPoint.x) / 2,
    y: (point.y + pPoint.y) / 2,
  };

  path.moveTo(mid1.x, mid1.y);
  path.quadTo(pPoint.x, pPoint.y, mid2.x, mid2.y);
}

export function progressLine(
  points: SharedValue<Point[]>,
  path: SkPath,
  point: Point,
  straightLine: boolean = false,
): void {
  'worklet';
  points.modify(value => {
    'worklet';

    value.push(point);

    return value;
  });

  const pointsCount = points.value.length;

  if (straightLine) {
    path.lineTo(point.x, point.y);
  } else if (pointsCount >= 3) {
    addPointToPath(
      path,
      points.value[pointsCount - 3],
      points.value[pointsCount - 2],
      point,
    );
  } else {
    addPointToPath(path, points.value[0], points.value[0], point);
  }
}

export function createPathFromPoints(points: Array<Point>): SkPath {
  'worklet';
  const pointsCount = points.length;
  const path = Skia.Path.Make();

  for (let pointIndex = 0; pointIndex < pointsCount; pointIndex++) {
    if (pointsCount >= 3 && pointIndex >= 2) {
      addPointToPath(
        path,
        points[pointIndex - 2],
        points[pointIndex - 1],
        points[pointIndex],
      );
    } else if (pointsCount >= 2 && pointIndex >= 1) {
      addPointToPath(path, points[0], points[0], points[pointIndex]);
    } else if (pointsCount >= 1) {
      const a = points[pointIndex];

      path.moveTo(a.x, a.y);
      path.lineTo(a.x, a.y);
    }
  }

  return path;
}

export function getCurrentShape(points: SharedValue<Point[]>): Shape {
  'worklet';
  const pointsCount = points.value.length;

  return pointsCount === 1 ? Shape.Dot : Shape.Line;
}
