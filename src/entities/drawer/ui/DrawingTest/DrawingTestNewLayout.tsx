import { FC } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Dimensions, useImageDimensions } from '@app/shared/lib';
import { XStack, YStack } from '@app/shared/ui';

import { DrawingTestProps } from './DrawingTest';
import {
  DrawResult,
  getElementsDimensions,
  SvgFileManager,
  ELEMENTS_GAP,
  HEIGHT_REDUCTION_FACTOR,
} from '../../lib';
import DrawingBoard from '../DrawingBoard';

const DrawingTest: FC<DrawingTestProps> = props => {
  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const onResult = async (result: DrawResult) => {
    const fileName = value.fileName;

    const fileMeta = SvgFileManager.getFileMeta(fileName);

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
    getElementsDimensions(props.dimensions, exampleImageDimensions);

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

export default DrawingTest;
