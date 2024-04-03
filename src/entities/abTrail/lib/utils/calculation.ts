import { AbTestPayload, Point } from '@app/abstract/lib';

export const transformCoordinates = (
  original: AbTestPayload,
  width: number,
): AbTestPayload => {
  const multiplier = width / 100;

  const transformed: AbTestPayload = {
    deviceType: original.deviceType,
    isLast: original.isLast,
    config: {
      fontSize: original.config.fontSize * multiplier,
      fontSizeBeginEnd: original.config.fontSizeBeginEnd
        ? original.config.fontSizeBeginEnd * multiplier
        : null,
      beginWordLength: original.config.beginWordLength
        ? original.config.beginWordLength * multiplier
        : null,
      endWordLength: original.config.endWordLength
        ? original.config.endWordLength * multiplier
        : null,
      radius: original.config.radius * multiplier,
    },
    nodes: original.nodes.map(x => ({
      cx: x.cx * multiplier,
      cy: x.cy * multiplier,
      label: x.label,
      orderIndex: x.orderIndex,
    })),
  };
  return transformed;
};

export const getDistance = (from: Point, to: Point): number => {
  return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
};

const MaxDistanceDiff = 10000;

interface IUtilsPath {
  getPoint(index: number): Point;
  countPoints(): number;
}

export class UtilsPath implements IUtilsPath {
  private points: Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  public getPoint(index: number) {
    return this.points[index];
  }

  public countPoints(): number {
    return this.points.length;
  }
}

export const getEquidistantPoint = (errorPath: IUtilsPath): Point | null => {
  const points: Point[] = [];

  const totalPoints = errorPath.countPoints();

  for (let i = 0; i < totalPoints; i++) {
    const point = errorPath.getPoint(i);
    points.push({ x: point.x, y: point.y });
  }

  if (points.length < 3) {
    return null;
  }

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  let bestDistanceDiff = MaxDistanceDiff;
  let foundIndex = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const currentPoint = points[i];

    const distanceToStart = getDistance(startPoint, currentPoint);
    const distanceToEnd = getDistance(endPoint, currentPoint);

    const currentDistanceDiff = Math.abs(distanceToStart - distanceToEnd);

    if (currentDistanceDiff < bestDistanceDiff) {
      bestDistanceDiff = currentDistanceDiff;
      foundIndex = i;
    }
  }

  return points[foundIndex];
};
