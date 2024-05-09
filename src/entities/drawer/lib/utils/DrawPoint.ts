import { Point } from '../types';

class DrawPoint implements Point {
  x: number;
  y: number;
  time: number;

  constructor(x: number, y: number, time?: number) {
    this.x = x;
    this.y = y;
    this.time = time ?? Date.now();
  }

  scale(sx: number): DrawPoint {
    return new DrawPoint(this.x / sx, this.y / sx, this.time);
  }
}

export default DrawPoint;
