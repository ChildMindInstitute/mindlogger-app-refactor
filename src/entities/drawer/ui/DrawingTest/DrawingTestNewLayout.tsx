import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Dimensions } from '@app/shared/lib';
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
    let fileName = value.fileName;

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

  const { exampleImageHeight, canvasContainerHeight, canvasSize } =
    getElementsDimensions(dimensions, !!imageUrl);

  const containerHeight = exampleImageHeight + canvasSize;

  return (
    <YStack
      {...props}
      height={containerHeight}
      alignItems="center"
      space={ELEMENTS_GAP}
    >
      {!!imageUrl && (
        <XStack jc="center" height={exampleImageHeight}>
          <CachedImage
            source={imageUrl}
            style={styles.exampleImage}
            resizeMode="contain"
          />
        </XStack>
      )}

      <YStack height={canvasContainerHeight}>
        {!!canvasSize && (
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
  } as const);

const styles = StyleSheet.create({
  exampleImage: {
    width: '100%',
    height: '100%',
  },
});

export default DrawingTest;
