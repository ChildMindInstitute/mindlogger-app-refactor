import { FC } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { useImageDimensions } from '@app/shared/lib/hooks/useImageDimensions';
import { Dimensions } from '@app/shared/lib/types/space';
import { XStack, YStack } from '@app/shared/ui/base';

import { DrawingTestProps } from './DrawingTest';
import { DrawResult } from '../../lib/types/draw';
import {
  ELEMENTS_GAP,
  HEIGHT_REDUCTION_FACTOR,
} from '../../lib/utils/constants';
import { getElementsDimensions } from '../../lib/utils/helpers';
import { getDefaultSvgFileManager } from '../../lib/utils/svgFileManagerInstance';
import { DrawingBoard } from '../DrawingBoard';

export const DrawingTestNewLayout: FC<DrawingTestProps> = props => {
  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const onResult = async (result: DrawResult) => {
    const fileName = value.fileName;

    const fileMeta = getDefaultSvgFileManager().getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  const dimensions: Dimensions = {
    width: props.dimensions.width,
    height: props.dimensions.height * HEIGHT_REDUCTION_FACTOR,
  };

  const {
    dimensions: exampleImageDimensions,
    isLoading: isEvaluatingDimensions,
  } = useImageDimensions(imageUrl);

  const { exampleImageHeight, canvasContainerHeight, canvasSize } =
    getElementsDimensions(dimensions, exampleImageDimensions);

  const containerHeight = exampleImageHeight + canvasSize;

  return (
    <YStack
      {...props}
      height={containerHeight}
      alignItems="center"
      space={ELEMENTS_GAP}
    >
      {!!imageUrl && (
        <XStack height={exampleImageHeight}>
          <CachedImage
            source={imageUrl}
            style={{ height: exampleImageHeight, width: canvasSize }}
            resizeMode="contain"
          />
        </XStack>
      )}

      <YStack height={canvasContainerHeight}>
        {!!canvasSize && !isEvaluatingDimensions && (
          <XStack width={canvasSize} height={canvasSize}>
            {!!backgroundImageUrl && (
              <CachedImage
                source={backgroundImageUrl}
                style={canvasStyles(canvasSize)}
                resizeMode="contain"
              />
            )}

            <DrawingBoard
              value={value.lines}
              onResult={onResult}
              width={canvasSize}
              onLog={onLog}
            />
          </XStack>
        )}
      </YStack>
    </YStack>
  );
};

const canvasStyles = (canvasSize: number) =>
  ({
    position: 'absolute',
    width: canvasSize,
    height: canvasSize,
  }) as const;
