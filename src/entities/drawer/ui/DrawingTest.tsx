import { FC } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { BoxProps, XStack, YStack } from '@app/shared/ui';
import {
  DrawingStreamEvent,
  StreamEventLoggable,
  useImageDimensions,
} from '@shared/lib';

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
    const fileName = value.fileName;

    const fileMeta = SvgFileManager.getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  const {
    dimensions: exampleImageDimensions,
    isLoading: isEvaluatingDimensions,
  } = useImageDimensions(imageUrl);

  const { exampleImageHeight, canvasContainerHeight, canvasSize } =
    getElementsDimensions(props.dimensions, exampleImageDimensions);

  const height = exampleImageHeight + canvasContainerHeight + ELEMENTS_GAP;

  return (
    <YStack {...props} height={height} alignItems="center" space={ELEMENTS_GAP}>
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
