/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { useImageDimensions } from '@app/shared/lib/hooks/useImageDimensions';
import { Box, XStack } from '@app/shared/ui/base';

import { DrawingTestProps } from './DrawingTest';
import { DrawResult } from '../../lib/types/draw';
import { getDefaultSvgFileManager } from '../../lib/utils/svgFileManagerInstance';
import { DrawingBoard } from '../DrawingBoard';

const RectPadding = 15;

export const DrawingTestLegacyLayout: FC<DrawingTestProps> = props => {
  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const availableWidth = props.dimensions.width - RectPadding * 2;
  // Reduce available height to ensure content fits without scrolling
  // The parent Box has mb="$6" which is approximately 24px
  // Use a larger safety margin for tablets/iPads to account for UI elements
  const isTablet = props.dimensions.width > 600;
  const bottomMarginFromParent = 24; // mb="$6"
  const additionalSafetyMargin = isTablet ? 70 : 50; // Increased margins
  const safetyMargin = bottomMarginFromParent + additionalSafetyMargin;
  const availableHeight = props.dimensions.height - safetyMargin;

  // Get the actual dimensions of the example image
  const { dimensions: exampleImageDimensions } = useImageDimensions(imageUrl);

  // Calculate optimal sizes
  let exampleImageWidth = 0;
  let exampleImageHeight = 0;
  let canvasSize = availableWidth; // Default canvas size if no example image

  if (exampleImageDimensions && imageUrl) {
    const gap = 20;

    // Strategy: Balance space between example image and canvas for optimal layout

    // First, calculate example image size based on available width
    exampleImageWidth = availableWidth;
    exampleImageHeight = Math.floor(
      availableWidth / exampleImageDimensions.aspectRatio,
    );

    // Check if this leaves enough space for the canvas
    const minCanvasSize = Math.min(availableWidth * 0.6, 300); // Canvas should be at least 60% of width or 300px
    const spaceNeededForCanvas = minCanvasSize + gap;
    const totalSpaceNeeded = exampleImageHeight + spaceNeededForCanvas;

    if (totalSpaceNeeded > availableHeight) {
      // Need to reduce example image size
      // Calculate the maximum height we can give to the example image
      const maxExampleHeight = availableHeight - spaceNeededForCanvas;

      if (maxExampleHeight > 50) {
        // Minimum viable height for example
        exampleImageHeight = maxExampleHeight;
        exampleImageWidth = Math.floor(
          maxExampleHeight * exampleImageDimensions.aspectRatio,
        );

        // Ensure it doesn't exceed available width
        if (exampleImageWidth > availableWidth) {
          exampleImageWidth = availableWidth;
          exampleImageHeight = Math.floor(
            availableWidth / exampleImageDimensions.aspectRatio,
          );
        }
      } else {
        // Very limited space - use fixed small size for example
        exampleImageHeight = Math.min(availableHeight * 0.25, 150);
        exampleImageWidth = Math.floor(
          exampleImageHeight * exampleImageDimensions.aspectRatio,
        );
      }
    }

    // Calculate final canvas size
    const remainingHeight = availableHeight - exampleImageHeight - gap;
    canvasSize = Math.min(availableWidth, remainingHeight);
  } else {
    // No example image, canvas can use most of the available space
    canvasSize = Math.min(availableWidth, availableHeight);
  }

  const onResult = (result: DrawResult) => {
    const fileName = value.fileName;

    const fileMeta = getDefaultSvgFileManager().getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  return (
    <Box {...props}>
      {!!imageUrl && exampleImageDimensions && (
        <XStack jc="center" mb={20}>
          <CachedImage
            source={imageUrl}
            style={{
              width: exampleImageWidth,
              height: exampleImageHeight,
            }}
            resizeMode="contain"
          />
        </XStack>
      )}

      {!!canvasSize && (
        <XStack jc="center">
          {!!backgroundImageUrl && (
            <CachedImage
              source={backgroundImageUrl}
              style={{
                position: 'absolute',
                width: canvasSize,
                height: canvasSize,
              }}
              resizeMode="contain"
            />
          )}

          <XStack width={canvasSize} height={canvasSize}>
            <DrawingBoard
              value={value.lines}
              onResult={onResult}
              width={canvasSize}
              onLog={onLog}
            />
          </XStack>
        </XStack>
      )}
    </Box>
  );
};
