import {
  CANVAS_HEIGHT_FACTOR,
  ELEMENTS_GAP,
  EXAMPLE_HEIGHT_FACTOR,
  RECT_PADDING,
} from './constants';
import { DrawLine } from '../types';

export const getChunkedPointsAsStrings = (lines: DrawLine[]) => {
  const results: string[] = [];
  const chunkSize: number = 50;

  for (const line of lines) {
    const { points } = line;
    const { length } = points;

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

const getCanvasSize = (dimensions: Dimensions, hasExampleImage: boolean) => {
  const factor = hasExampleImage ? CANVAS_HEIGHT_FACTOR : 1;
  const canvasHeight = dimensions.height * factor - ELEMENTS_GAP;
  const containerWidth = dimensions.width - RECT_PADDING * 2;

  const result = canvasHeight > containerWidth ? containerWidth : canvasHeight;

  return result;
};

const getExampleImageSize = (height: number, hasExampleImage: boolean) => {
  return hasExampleImage ? height * EXAMPLE_HEIGHT_FACTOR : 0;
};

const getCanvasContainerHeight = (height: number, hasExampleImage: boolean) => {
  return (
    (hasExampleImage ? height * CANVAS_HEIGHT_FACTOR : height) - ELEMENTS_GAP
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
    dimensions.height,
    hasExampleImage,
  );

  const canvasSize = getCanvasSize(dimensions, hasExampleImage);

  return {
    exampleImageHeight,
    canvasContainerHeight,
    canvasSize,
  };
};
