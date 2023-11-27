import { PaintStyle, Skia, SkPath } from '@shopify/react-native-skia';

import { colors, IS_ANDROID } from '@app/shared/lib';

export type Point = {
  x: number;
  y: number;
};

export const enum Shape {
  Dot = 'dot',
  Line = 'line',
}
const paint = Skia.Paint();

paint.setColor(Skia.Color(colors.black));
paint.setStrokeWidth(1.5);
paint.setStyle(PaintStyle.Stroke);

class LineSketcher {
  private points: Array<Point>;

  constructor() {
    this.points = [];
  }

  private static addPointToPath(
    path: SkPath,
    tPoint: Point,
    pPoint: Point,
    point: Point,
  ): void {
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

  public static createPathFromPoints(points: Array<Point>): SkPath {
    const pointsCount = points.length;
    const path = Skia.Path.Make();

    for (let pointIndex = 0; pointIndex < pointsCount; pointIndex++) {
      if (pointsCount >= 3 && pointIndex >= 2) {
        LineSketcher.addPointToPath(
          path,
          points[pointIndex - 2],
          points[pointIndex - 1],
          points[pointIndex],
        );
      } else if (pointsCount >= 2 && pointIndex >= 1) {
        LineSketcher.addPointToPath(
          path,
          points[0],
          points[0],
          points[pointIndex],
        );
      } else if (pointsCount >= 1) {
        const a = points[pointIndex];

        path.moveTo(a.x, a.y);
        path.lineTo(a.x, a.y);
      }
    }

    return path;
  }

  public createLine(point: Point, startFromPoint: Point = point): SkPath {
    this.points = [point];

    const newPath = Skia.Path.Make();

    newPath.moveTo(startFromPoint.x, startFromPoint.y);
    newPath.lineTo(point.x, point.y);

    return newPath;
  }

  public progressLine(path: SkPath, point: Point): void {
    this.points.push(point);

    const pointsCount = this.points.length;

    if (pointsCount >= 3) {
      LineSketcher.addPointToPath(
        path,
        this.points[pointsCount - 3],
        this.points[pointsCount - 2],
        point,
      );
    } else {
      LineSketcher.addPointToPath(path, this.points[0], this.points[0], point);
    }
  }

  public shouldCreateNewLine(): boolean {
    const pointsCount = this.points.length;
    const suggestedMaxPointsPerLine = IS_ANDROID ? 300 : Infinity;

    return pointsCount % suggestedMaxPointsPerLine === 0;
  }

  public getCurrentShape(): Shape {
    const pointsCount = this.points.length;

    return pointsCount === 1 ? Shape.Dot : Shape.Line;
  }

  public getFirstPoint(): Point {
    return this.points[0];
  }
}

export default LineSketcher;
