/* eslint-disable react-native/no-inline-styles */
import { FC, useMemo } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { FeatureFlagsKeys } from '@app/shared/lib/featureFlags/FeatureFlags.types';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { useImageDimensions } from '@app/shared/lib/hooks/useImageDimensions';
import { Box, XStack } from '@app/shared/ui/base';

import { DrawingTestProps } from './DrawingTest';
import { DrawResult } from '../../lib/types/draw';
import { getDefaultSvgFileManager } from '../../lib/utils/svgFileManagerInstance';
import { DrawingBoard } from '../DrawingBoard';

const RectPadding = 15;

interface LayoutDimensions {
  exampleImageWidth: number;
  exampleImageHeight: number;
  canvasSize: number;
}

export const DrawingTestLegacyLayout: FC<DrawingTestProps> = props => {
  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const enableBetterDrawingImageSizing =
    getDefaultFeatureFlagsService().evaluateFlag(
      FeatureFlagsKeys.enableBetterDrawingImageSizing,
    );

  const width = props.dimensions.width - RectPadding * 2;
  const { dimensions: exampleImageDimensions } = useImageDimensions(imageUrl);

  const onResult = (result: DrawResult) => {
    const fileName = value.fileName;
    const fileMeta = getDefaultSvgFileManager().getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  // Calculate dimensions based on feature flag
  const dimensions = useMemo<LayoutDimensions>(() => {
    if (!enableBetterDrawingImageSizing) {
      // OLD IMPLEMENTATION: Fixed 300x300 sizing
      return {
        exampleImageWidth: 300,
        exampleImageHeight: 300,
        canvasSize: width,
      };
    }

    // NEW IMPLEMENTATION: Dynamic sizing
    const availableWidth = width;
    const isTablet = props.dimensions.width > 600;
    const bottomMarginFromParent = 24; // mb="$6"
    const additionalSafetyMargin = isTablet ? 70 : 50;
    const safetyMargin = bottomMarginFromParent + additionalSafetyMargin;
    const availableHeight = props.dimensions.height - safetyMargin;

    if (!exampleImageDimensions || !imageUrl) {
      // No example image, canvas can use most of the available space
      return {
        exampleImageWidth: 0,
        exampleImageHeight: 0,
        canvasSize: Math.min(availableWidth, availableHeight),
      };
    }

    // Calculate with example image
    const gap = 20;
    let exampleImageWidth = availableWidth;
    let exampleImageHeight = Math.floor(
      availableWidth / exampleImageDimensions.aspectRatio,
    );

    const minCanvasSize = Math.min(availableWidth * 0.6, 300);
    const spaceNeededForCanvas = minCanvasSize + gap;
    const totalSpaceNeeded = exampleImageHeight + spaceNeededForCanvas;

    if (totalSpaceNeeded > availableHeight) {
      const maxExampleHeight = availableHeight - spaceNeededForCanvas;

      if (maxExampleHeight > 50) {
        exampleImageHeight = maxExampleHeight;
        exampleImageWidth = Math.floor(
          maxExampleHeight * exampleImageDimensions.aspectRatio,
        );

        if (exampleImageWidth > availableWidth) {
          exampleImageWidth = availableWidth;
          exampleImageHeight = Math.floor(
            availableWidth / exampleImageDimensions.aspectRatio,
          );
        }
      } else {
        exampleImageHeight = Math.min(availableHeight * 0.25, 150);
        exampleImageWidth = Math.floor(
          exampleImageHeight * exampleImageDimensions.aspectRatio,
        );
      }
    }

    const remainingHeight = availableHeight - exampleImageHeight - gap;
    const canvasSize = Math.min(availableWidth, remainingHeight);

    return {
      exampleImageWidth,
      exampleImageHeight,
      canvasSize,
    };
  }, [
    enableBetterDrawingImageSizing,
    width,
    props.dimensions,
    exampleImageDimensions,
    imageUrl,
  ]);

  // Render legacy layout (feature flag OFF)
  const renderLegacyLayout = () => (
    <Box {...props}>
      {!!imageUrl && (
        <XStack jc="center">
          <CachedImage
            source={imageUrl}
            style={{
              width: 300,
              height: 300,
              padding: 20,
              paddingBottom: 0,
              marginBottom: 20,
            }}
            resizeMode="contain"
          />
        </XStack>
      )}

      {!!width && (
        <XStack jc="center">
          {!!backgroundImageUrl && (
            <CachedImage
              source={backgroundImageUrl}
              style={{ position: 'absolute', width, height: width }}
              resizeMode="contain"
            />
          )}

          <XStack width={width} height={width}>
            <DrawingBoard
              value={value.lines}
              onResult={onResult}
              width={width}
              onLog={onLog}
            />
          </XStack>
        </XStack>
      )}
    </Box>
  );

  // Render dynamic layout (feature flag ON)
  const renderDynamicLayout = () => (
    <Box {...props}>
      {!!imageUrl && !!exampleImageDimensions && (
        <XStack jc="center" mb={20}>
          <CachedImage
            source={imageUrl}
            style={{
              width: dimensions.exampleImageWidth,
              height: dimensions.exampleImageHeight,
            }}
            resizeMode="contain"
          />
        </XStack>
      )}

      {!!dimensions.canvasSize && (
        <XStack jc="center">
          {!!backgroundImageUrl && (
            <CachedImage
              source={backgroundImageUrl}
              style={{
                position: 'absolute',
                width: dimensions.canvasSize,
                height: dimensions.canvasSize,
              }}
              resizeMode="contain"
            />
          )}

          <XStack width={dimensions.canvasSize} height={dimensions.canvasSize}>
            <DrawingBoard
              value={value.lines}
              onResult={onResult}
              width={dimensions.canvasSize}
              onLog={onLog}
            />
          </XStack>
        </XStack>
      )}
    </Box>
  );

  // Return appropriate layout based on feature flag
  return enableBetterDrawingImageSizing
    ? renderDynamicLayout()
    : renderLegacyLayout();
};
