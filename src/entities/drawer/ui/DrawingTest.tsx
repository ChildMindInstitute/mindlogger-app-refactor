import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { BoxProps, XStack, YStack } from '@app/shared/ui';
import { DrawingStreamEvent, StreamEventLoggable } from '@shared/lib';

import DrawingBoard from './DrawingBoard';
import {
  DrawLine,
  DrawResult,
  getElementsDimensions,
  SvgFileManager,
  ELEMENTS_GAP,
} from '../lib';

type Props = {
  value: { lines: DrawLine[]; fileName: string | null };
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  dimensions: {
    height: number;
    width: number;
  };
  onResult: (result: DrawResult) => void;
  toggleScroll: (isScrollEnabled: boolean) => void;
} & StreamEventLoggable<DrawingStreamEvent> &
  BoxProps;

const DrawingTest: FC<Props> = props => {
  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const onResult = async (result: DrawResult) => {
    let fileName = value.fileName;

    const fileMeta = SvgFileManager.getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  const { exampleImageHeight, canvasContainerHeight, canvasSize } =
    getElementsDimensions(props.dimensions, !!imageUrl);

  return (
    <YStack {...props} alignItems="center" space={ELEMENTS_GAP}>
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
