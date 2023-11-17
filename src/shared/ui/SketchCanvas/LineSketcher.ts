import { MutableRefObject } from 'react';

import { PaintStyle, SkCanvas, Skia, SkPath } from '@shopify/react-native-skia';

import { colors } from '@app/shared/lib';

export type Point = {
  x: number;
  y: number;
};

type PathsRef = MutableRefObject<Array<SkPath>>;
type CanvasRef = MutableRefObject<SkCanvas | null>;
type PointsRef = MutableRefObject<Array<Point>>;

const paint = Skia.Paint();

paint.setColor(Skia.Color(colors.black));
paint.setStrokeWidth(1.5);
paint.setStyle(PaintStyle.Stroke);

class LineSketcher {
  pathsRef: PathsRef;
  canvasRef: CanvasRef;
  pointsRef: PointsRef;

  constructor(pathsRef: PathsRef, canvasRef: CanvasRef, pointsRef: PointsRef) {
    this.pathsRef = pathsRef;
    this.canvasRef = canvasRef;
    this.pointsRef = pointsRef;
  }

  private get paths() {
    return this.pathsRef.current;
  }

  private get canvas() {
    return this.canvasRef.current;
  }

  private get points() {
    return this.pointsRef.current;
  }

  private set points(points: Array<Point>) {
    this.pointsRef.current = points;
  }

  private static addPointToPath(
    path: SkPath,
    tPoint: Point,
    pPoint: Point,
    point: Point,
  ) {
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

  public static drawPaths(canvas: SkCanvas, paths: Array<SkPath>): void {
    paths.forEach(path => {
      canvas.drawPath(path, paint);
    });
  }

  public createLine(point: Point): void {
    if (!this.canvas) {
      return;
    }

    this.points = [point];

    const newPath = Skia.Path.Make();

    newPath.moveTo(point.x, point.y);

    this.paths.push(newPath);

    this.canvas.drawPath(newPath, paint);
  }

  public progressLine(point: Point): void {
    this.points.push(point);

    const pointsCount = this.points.length;

    const currentPath = this.paths[this.paths.length - 1];

    if (pointsCount >= 3) {
      LineSketcher.addPointToPath(
        currentPath,
        this.points[pointsCount - 3],
        this.points[pointsCount - 2],
        point,
      );
    } else {
      LineSketcher.addPointToPath(
        currentPath,
        this.points[0],
        this.points[0],
        point,
      );
    }
  }
}

export default LineSketcher;
