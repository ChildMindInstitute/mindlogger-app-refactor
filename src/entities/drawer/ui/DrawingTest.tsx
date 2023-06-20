/* eslint-disable react-native/no-inline-styles */
import { FC, useContext, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { FileSystem } from 'react-native-file-access';
import RNFetchBlob from 'rn-fetch-blob';

import { ActivityScrollContext } from '@app/features/pass-survey';
import { Box, BoxProps, Center, Text, XStack } from '@app/shared/ui';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawResult } from '../lib';

const RectPadding = 15;

const filesCacheDir = RNFetchBlob.fs.dirs.CacheDir;

type Props = {
  value: Array<DrawLine>;
  outputFileName: string;
  imageUrl: string | null;
  isDrawingActive: boolean;
  backgroundImageUrl: string | null;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
  onToggleDrawing: () => void;
} & BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);
  const { scrollToEnd } = useContext(ActivityScrollContext);

  const {
    value,
    backgroundImageUrl,
    imageUrl,
    onStarted,
    outputFileName,
    onToggleDrawing,
    isDrawingActive,
  } = props;

  const getFilePath = () => {
    return `file://${filesCacheDir}/${outputFileName}.svg`;
  };

  const onResult = async (result: DrawResult) => {
    const path = getFilePath();

    try {
      const fileExists = await FileSystem.exists(path);

      if (fileExists) {
        await FileSystem.unlink(path);
      }

      await FileSystem.writeFile(path, result.svgString);
    } catch (error) {
      console.warn(
        '[DrawingTest.onResult]: Error occurred while write file\n\n',
        error,
      );
      return;
    }

    result.fileName = `${outputFileName}.svg`;
    result.type = 'image/svg';
    result.uri = path;

    props.onResult(result);
  };

  const handleToggle = () => {
    !isDrawingActive && scrollToEnd();

    onToggleDrawing();
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

      <TouchableOpacity onPress={handleToggle}>
        <Center mb={16}>
          <Text color={isDrawingActive ? '$red' : '$primary'} fontSize={18}>
            {isDrawingActive
              ? 'Tap here to stop drawing' // @todo stop drawing
              : 'Tap here to start drawing'}
          </Text>
        </Center>
      </TouchableOpacity>

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
            value={value}
            isDrawingActive={isDrawingActive}
            onResult={onResult}
            onStarted={onStarted}
            width={width}
          />
        </XStack>
      )}
    </Box>
  );
};

export default DrawingTest;
