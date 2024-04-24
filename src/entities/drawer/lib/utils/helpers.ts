import { Skia, SkPath } from '@shopify/react-native-skia';

import { getBezierArray } from './bezier';
import {
  CANVAS_HEIGHT_FACTOR,
  ELEMENTS_GAP,
  EXAMPLE_HEIGHT_FACTOR,
  RECT_PADDING,
} from './constants';
import { DrawLine, Point } from '../types';

export const convertToSkPaths = (
  lines: DrawLine[],
  startFrom: number,
): SkPath[] => {
  const skPaths: SkPath[] = [];

  for (let line of lines.slice(startFrom)) {
    if (!line.points.length) {
      continue;
    }

    const curvePoints: Point[] = getBezierArray(line.points, []);

    const { x, y } = curvePoints[0];

    const path = Skia.Path.Make().moveTo(x, y);

    for (let point of curvePoints.slice(1)) {
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

    for (let index = 0; index < length; index += chunkSize) {
      const myChunk = line.points.slice(index, index + chunkSize + 1);

      results.push(myChunk.map(point => `${point.x},${point.y}`).join(' '));
    }
  }
  return results;
};

export type Dimensions = {
  width: number;
  height: number;
};

export const getCanvasSize = (
  dimensions: Dimensions,
  hasExampleImage: boolean,
) => {
  const factor = hasExampleImage ? CANVAS_HEIGHT_FACTOR : 1;
  const canvasHeight = dimensions.height * factor - ELEMENTS_GAP;
  const containerWidth = dimensions.width - RECT_PADDING * 2;

  let result = canvasHeight;

  if (canvasHeight > containerWidth) {
    result = containerWidth;
  } else if (containerWidth > canvasHeight) {
    result = canvasHeight;
  }

  return result;
};

export const getExampleImageSize = (
  height: number,
  hasExampleImage: boolean,
) => {
  return hasExampleImage ? height * EXAMPLE_HEIGHT_FACTOR : 0;
};

export const getCanvasContainerHeight = (
  dimensions: Dimensions,
  hasExampleImage: boolean,
) => {
  return (
    (hasExampleImage
      ? dimensions.height * CANVAS_HEIGHT_FACTOR
      : dimensions.height) - ELEMENTS_GAP
  );
};

export const getElementsDimensions = (
  dimensions: Dimensions,
  hasExampleImage: boolean,
) => {
  const exampleImageHeight = getExampleImageSize(
    dimensions.height,
    hasExampleImage,
  );

  const canvasContainerHeight = getCanvasContainerHeight(
    dimensions,
    hasExampleImage,
  );

  const canvasSize = getCanvasSize(dimensions, hasExampleImage);

  return {
    exampleImageHeight,
    canvasContainerHeight,
    canvasSize,
  };
};
