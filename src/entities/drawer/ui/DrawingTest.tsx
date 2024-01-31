/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, BoxProps, XStack } from '@app/shared/ui';
import { StreamEventLoggable } from '@shared/lib';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawResult, LogPoint, SvgFileManager } from '../lib';

const RectPadding = 15;

type Props = {
  value: { lines: DrawLine[]; fileName: string | null };
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  onResult: (result: DrawResult) => void;
  toggleScroll: (isScrollEnabled: boolean) => void;
} & StreamEventLoggable<LogPoint> &
  BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);

  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const onResult = async (result: DrawResult) => {
    let fileName = value.fileName;

    const fileMeta = SvgFileManager.getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  return (
    <Box
      {...props}
      onLayout={x => {
        const containerWidth = x.nativeEvent.layout.width - RectPadding * 2;

        if (containerWidth > 0) {
          setWidth(containerWidth);
        }
      }}
    >
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

          <DrawingBoard
            value={value.lines}
            onResult={onResult}
            width={width}
            onLog={onLog}
          />
        </XStack>
      )}
    </Box>
  );
};

export default DrawingTest;
