import { CachedBezierItem, Point } from '../types';

function getBezierPoint(
  startPoint: Point,
  anchorPoint: Point,
  endPoint: Point,
  tIndex: number,
): Point {
  const x =
    Math.pow(1 - tIndex, 2) * startPoint.x +
    2 * tIndex * (1 - tIndex) * anchorPoint.x +
    Math.pow(tIndex, 2) * endPoint.x;
  const y =
    Math.pow(1 - tIndex, 2) * startPoint.y +
    2 * tIndex * (1 - tIndex) * anchorPoint.y +
    Math.pow(tIndex, 2) * endPoint.y;
  return { x, y };
}

function getBezierCurvePoints(
  startPoint: Point,
  anchorPoint: Point,
  endPoint: Point,
  pointsCount: number,
): Point[] {
  const curvePoints: Point[] = [];

  for (let i = 0; i <= pointsCount; i++) {
    const tIndex = i / pointsCount;
    const point = getBezierPoint(startPoint, anchorPoint, endPoint, tIndex);
    curvePoints.push(point);
  }

  return curvePoints;
}

const CurvePointsCount = 5;
const MiddlePointIndex = Math.floor(CurvePointsCount / 2);

const buildResultArray = (
  originalPoints: Point[],
  cachedBezierPoints: Array<CachedBezierItem>,
) => {
  const result: Point[] = [];

  result.push(originalPoints[0]);

  for (let i = 1; i < cachedBezierPoints.length; i++) {
    const current = cachedBezierPoints[i];

    result.push(...current.curveResult);
    result.push(current.middleInCurve);

    if (i === cachedBezierPoints.length - 1) {
      result.push(...current.curveToInterpolate);
    }
  }

  const lastOriginalPoint: Point = originalPoints[originalPoints.length - 1];
  result.push(lastOriginalPoint);

  return result;
};

export const getBezierArray = (
  originalPoints: Point[],
  cachedBezierPoints: Array<CachedBezierItem>,
): Point[] => {
  if (originalPoints.length === 1) {
    const point = originalPoints[0];
    return [
      { x: point.x, y: point.y },
      { x: point.x + 1, y: point.y + 1 },
    ];
  }

  if (originalPoints.length === 2) {
    return [...originalPoints];
  }

  if (cachedBezierPoints.length === 0) {
    cachedBezierPoints.push({} as CachedBezierItem);
  }

  const startIndex = cachedBezierPoints.length;

  for (let i = startIndex; i < originalPoints.length - 1; i++) {
    const current = originalPoints[i];

    const startPoint: Point = originalPoints[i - 1];
    const anchorPoint: Point = originalPoints[i];
    const endPoint: Point = originalPoints[i + 1];

    const curve: Point[] = getBezierCurvePoints(
      startPoint,
      anchorPoint,
      endPoint,
      CurvePointsCount,
    );

    const shouldInterpolate = i > 1;

    const currentPoints = curve.slice(1, MiddlePointIndex);

    const nextPointsToInterpolate = curve.slice(MiddlePointIndex + 1, -1);

    if (!shouldInterpolate) {
      cachedBezierPoints.push({
        original: current,
        curveToInterpolate: nextPointsToInterpolate,
        curveResult: currentPoints,
        middleInCurve: curve[MiddlePointIndex],
      });
      continue;
    }

    const previousCachedData = cachedBezierPoints[i - 1];

    const interpolatedCurvePoints: Point[] = [];

    for (let j = 0; j < currentPoints.length; j++) {
      const point1 = previousCachedData.curveToInterpolate[j];
      const point2 = currentPoints[j];

      const interpolatedPoint: Point = {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2,
      };
      interpolatedCurvePoints.push(interpolatedPoint);
    }

    cachedBezierPoints.push({
      original: current,
      middleInCurve: curve[MiddlePointIndex],
      curveResult: interpolatedCurvePoints,
      curveToInterpolate: nextPointsToInterpolate,
    });
  }

  return buildResultArray(originalPoints, cachedBezierPoints);
};
