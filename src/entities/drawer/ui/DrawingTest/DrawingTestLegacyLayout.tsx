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

// Layout Constants
const RECT_PADDING = 15;
const DEFAULT_IMAGE_SIZE = 300;
const GAP_SIZE = 20;
const MIN_EXAMPLE_HEIGHT = 50;
const FALLBACK_EXAMPLE_HEIGHT_FACTOR = 0.25;
const MAX_FALLBACK_EXAMPLE_HEIGHT = 150;
const MIN_CANVAS_SIZE_FACTOR = 0.6;
const MAX_CANVAS_SIZE = 300;

// Device Detection
const TABLET_WIDTH_THRESHOLD = 600;

// Margins
const BOTTOM_MARGIN_FROM_PARENT = 24; // mb="$6"
const TABLET_SAFETY_MARGIN = 70;
const PHONE_SAFETY_MARGIN = 50;

interface LayoutDimensions {
  exampleImageWidth: number;
  exampleImageHeight: number;
  canvasSize: number;
}

export const DrawingTestLegacyLayout: FC<DrawingTestProps> = props => {
  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  // Dynamic Sizing Feature:
  // We only use the smart resizing when BOTH conditions are met:
  // 1. The feature flag is enabled (controlled by LaunchDarkly or dev override)
  // 2. There's actually an example image to show
  // Without an example image, we stick to the old fixed-size layout
  const enableBetterDrawingImageSizing =
    getDefaultFeatureFlagsService().evaluateFlag(
      FeatureFlagsKeys.enableBetterDrawingImageSizing,
    ) && !!imageUrl;

  const width = props.dimensions.width - RECT_PADDING * 2;
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
      // LEGACY LAYOUT: Fixed sizes that don't adapt to screen
      // - Example image: Always 300x300 (might be too big on small phones)
      // - Drawing canvas: Uses full available width (could be huge on tablets)
      // This is what we're improving with the dynamic sizing!
      return {
        exampleImageWidth: DEFAULT_IMAGE_SIZE,
        exampleImageHeight: DEFAULT_IMAGE_SIZE,
        canvasSize: width,
      };
    }

    // SMART DYNAMIC SIZING: Adapts to any screen size
    // Goal: Make both the example image and drawing canvas fit nicely on screen

    // Step 1: Figure out how much space we have to work with
    const availableWidth = width;
    const isTablet = props.dimensions.width > TABLET_WIDTH_THRESHOLD;

    // We need some breathing room at the bottom for UI elements
    const additionalSafetyMargin = isTablet
      ? TABLET_SAFETY_MARGIN
      : PHONE_SAFETY_MARGIN;
    const safetyMargin = BOTTOM_MARGIN_FROM_PARENT + additionalSafetyMargin;
    const availableHeight = props.dimensions.height - safetyMargin;

    if (!exampleImageDimensions || !imageUrl) {
      // Special case: No example image to show
      // Let the drawing canvas use as much space as possible
      // (but keep it square and not bigger than the screen)
      return {
        exampleImageWidth: 0,
        exampleImageHeight: 0,
        canvasSize: Math.min(availableWidth, availableHeight),
      };
    }

    // Step 2: Start with the example image at full width
    // We'll shrink it later if needed to fit everything on screen
    const gap = GAP_SIZE; // Space between example image and drawing canvas
    let exampleImageWidth = availableWidth;
    let exampleImageHeight = Math.floor(
      availableWidth / exampleImageDimensions.aspectRatio,
    );

    // Step 3: Ensure the drawing canvas gets a reasonable size
    // At least 60% of screen width, but no more than 300px (nice for drawing)
    const minCanvasSize = Math.min(
      availableWidth * MIN_CANVAS_SIZE_FACTOR,
      MAX_CANVAS_SIZE,
    );
    const spaceNeededForCanvas = minCanvasSize + gap;
    const totalSpaceNeeded = exampleImageHeight + spaceNeededForCanvas;

    // Step 4: Check if everything fits vertically
    if (totalSpaceNeeded > availableHeight) {
      // Oops, too tall! We need to shrink the example image
      const maxExampleHeight = availableHeight - spaceNeededForCanvas;

      if (maxExampleHeight > MIN_EXAMPLE_HEIGHT) {
        // There's enough room for a decent-sized example image
        exampleImageHeight = maxExampleHeight;
        exampleImageWidth = Math.floor(
          maxExampleHeight * exampleImageDimensions.aspectRatio,
        );

        // But wait, make sure it still fits horizontally!
        if (exampleImageWidth > availableWidth) {
          exampleImageWidth = availableWidth;
          exampleImageHeight = Math.floor(
            availableWidth / exampleImageDimensions.aspectRatio,
          );
        }
      } else {
        // Very little space - make the example image tiny
        // Use 25% of available height, but cap at 150px so it's not microscopic
        exampleImageHeight = Math.min(
          availableHeight * FALLBACK_EXAMPLE_HEIGHT_FACTOR,
          MAX_FALLBACK_EXAMPLE_HEIGHT,
        );
        exampleImageWidth = Math.floor(
          exampleImageHeight * exampleImageDimensions.aspectRatio,
        );
      }
    }

    // Step 5: Calculate the final canvas size
    // Use whatever vertical space is left, but keep it square (width = height)
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

  // LEGACY LAYOUT: This is what users see when the feature flag is OFF
  // Problems with this approach:
  // - Fixed 300x300 example image (too big for small phones, too small for tablets)
  // - Drawing canvas doesn't adjust to available space
  // - Can create scrolling issues on small screens
  const renderLegacyLayout = () => (
    <Box {...props}>
      {!!imageUrl && (
        <XStack jc="center">
          <CachedImage
            source={imageUrl}
            style={{
              width: DEFAULT_IMAGE_SIZE,
              height: DEFAULT_IMAGE_SIZE,
              padding: GAP_SIZE,
              paddingBottom: 0,
              marginBottom: GAP_SIZE,
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

  // DYNAMIC LAYOUT: This is the new smart sizing when feature flag is ON
  // Benefits:
  // - Example image scales to fit the screen perfectly
  // - Drawing canvas is always a comfortable size for drawing
  // - No scrolling needed - everything fits on one screen
  // - Works great on phones, tablets, and everything in between
  const renderDynamicLayout = () => (
    <Box {...props}>
      {!!imageUrl && !!exampleImageDimensions && (
        <XStack jc="center" mb={GAP_SIZE}>
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

  // Choose which layout to render based on our feature flag
  // This allows us to:
  // 1. Test the new dynamic sizing with specific users/groups
  // 2. Quickly roll back if any issues are found
  // 3. Gradually roll out to all users once we're confident
  return enableBetterDrawingImageSizing
    ? renderDynamicLayout()
    : renderLegacyLayout();
};
