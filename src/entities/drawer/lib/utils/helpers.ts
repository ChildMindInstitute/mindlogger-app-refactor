import { ImageDimensions } from '@app/shared/lib/hooks/useImageDimensions';
import { Dimensions } from '@app/shared/lib/types/space';

import {
  CANVAS_HEIGHT_FACTOR,
  ELEMENTS_GAP,
  EXAMPLE_HEIGHT_FACTOR,
  RECT_PADDING,
} from './constants';
import { DrawLine } from '../types/draw';

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

const getCanvasSize = (
  itemDimensions: Dimensions,
  hasExampleImage: boolean,
) => {
  const factor = hasExampleImage ? CANVAS_HEIGHT_FACTOR : 1;
  const canvasHeight = itemDimensions.height * factor - ELEMENTS_GAP;
  const containerWidth = itemDimensions.width - RECT_PADDING * 2;

  const result = canvasHeight > containerWidth ? containerWidth : canvasHeight;

  return result;
};

const getExampleImageSize = (
  itemDimensions: Dimensions,
  exampleImageDimensions: ImageDimensions | null,
) => {
  if (!exampleImageDimensions) {
    return 0;
  }

  const maxHeight = itemDimensions.height * EXAMPLE_HEIGHT_FACTOR;
  const height = Math.floor(
    itemDimensions.width / exampleImageDimensions.aspectRatio,
  );

  return height > maxHeight ? maxHeight : height;
};

const getCanvasContainerHeight = (height: number, hasExampleImage: boolean) => {
  return (
    (hasExampleImage ? height * CANVAS_HEIGHT_FACTOR : height) - ELEMENTS_GAP
  );
};

export const getElementsDimensions = (
  itemDimensions: Dimensions,
  exampleImageDimensions: ImageDimensions | null,
) => {
  const exampleImageHeight = getExampleImageSize(
    itemDimensions,
    exampleImageDimensions,
  );

  const canvasContainerHeight = getCanvasContainerHeight(
    itemDimensions.height,
    !!exampleImageDimensions,
  );

  const canvasSize = getCanvasSize(itemDimensions, !!exampleImageDimensions);

  return {
    exampleImageHeight,
    canvasContainerHeight,
    canvasSize,
  };
};
