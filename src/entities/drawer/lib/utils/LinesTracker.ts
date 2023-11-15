import { MutableRefObject } from 'react';

import { Path } from '@sourcetoad/react-native-sketch-canvas/lib/typescript/types';

import DrawPoint from './DrawPoint';
import { DrawLine } from '../types';

type OnPointAddedCallback = (point: DrawPoint) => void;
type LinesRef = MutableRefObject<DrawLine[]>;

type Callbacks = {
  onPointAdded: OnPointAddedCallback;
};

class LinesTracker {
  private linesRef: LinesRef;
  private onPointAdded: OnPointAddedCallback;

  constructor(linesRef: LinesRef, callbacks: Callbacks) {
    this.linesRef = linesRef;

    this.onPointAdded = callbacks.onPointAdded;
  }

  private get lines(): DrawLine[] {
    return this.linesRef.current;
  }

  private get lastLine(): DrawLine {
    const lastIndex = this.lines.length - 1;

    return this.lines[lastIndex];
  }

  public static fromDrawLines(
    lines: Array<DrawLine>,
    canvasWidth: number,
  ): Array<Path> {
    const paths: Array<Path> = lines.map((line, i) => {
      const path: Path = {
        size: { width: canvasWidth, height: canvasWidth },
        path: {
          color: 'black',
          width: 1.5,
          id: i + 1,
          data: line.points.map(point => `${point.x},${point.y}`),
        },
      };

      return path;
    });

    return paths;
  }

  public createLine(x: number, y: number): void {
    const point = new DrawPoint(x, y);

    const newLine: DrawLine = {
      points: [point],
      startTime: Date.now(),
    };

    this.lines.push(newLine);

    this.onPointAdded(point);
  }

  public progressLine(x: number, y: number): void {
    if (this.lines.length === 0) {
      return;
    }

    const point = new DrawPoint(x, y);

    this.lastLine.points.push(point);

    this.onPointAdded(point);
  }
}

export default LinesTracker;
