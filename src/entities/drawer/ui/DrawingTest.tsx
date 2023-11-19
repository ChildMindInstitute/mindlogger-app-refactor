/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';
import { FileSystem, Dirs } from 'react-native-file-access';
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

import { Box, BoxProps, XStack } from '@app/shared/ui';
import { StreamEventLoggable } from '@shared/lib';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawPoint, DrawResult } from '../lib';

const RectPadding = 15;

const filesCacheDir = Dirs.CacheDir;

type Props = {
  value: { lines: DrawLine[]; fileName: string | null };
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  onResult: (result: DrawResult) => void;
  toggleScroll: (isScrollEnabled: boolean) => void;
} & StreamEventLoggable<DrawPoint> &
  BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);

  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const getFilePath = (fileName: string) => {
    return `file://${filesCacheDir}/${fileName}`;
  };

  const onResult = async (result: DrawResult) => {
    let fileName = value.fileName;

    if (!fileName?.length) {
      fileName = `${uuidv4()}.svg`;
    }

    const path = getFilePath(fileName);

    result.fileName = fileName;
    result.type = 'image/svg';
    result.uri = path;

    props.onResult(result);

    writeFile.cancel();
    writeFile(path, result.svgString);
  };

  const writeFile = useDebouncedCallback(async (path: string, svg: string) => {
    try {
      const fileExists = await FileSystem.exists(path);

      if (fileExists) {
        await FileSystem.unlink(path);
      }

      await FileSystem.writeFile(path, svg);
    } catch (error) {
      console.warn(
        '[DrawingTest.onResult]: Error occurred while delete or write file\n\n',
        error,
      );
      return;
    }
  }, 500);

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
