/* eslint-disable react-native/no-inline-styles */
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { FileSystem, Dirs } from 'react-native-file-access';
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

import { ActivityScrollContext } from '@app/features/pass-survey';
import { Box, BoxProps, Center, Text, XStack } from '@app/shared/ui';
import { IS_ANDROID, IS_IOS, runOnIOS, StreamEventLoggable } from '@shared/lib';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawPoint, DrawResult } from '../lib';

const RectPadding = 15;

const filesCacheDir = Dirs.CacheDir;

const SCROLL_ENABLING_DELAY = 300;

type Props = {
  value: { lines: DrawLine[]; fileName: string | null };
  imageUrl: string | null;
  isDrawingActive: boolean;
  backgroundImageUrl: string | null;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
  toggleScroll: (isScrollEnabled: boolean) => void;
} & StreamEventLoggable<DrawPoint> &
  BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);
  const { scrollToEnd, isAreaScrollable } = useContext(ActivityScrollContext);

  const {
    value,
    backgroundImageUrl,
    imageUrl,
    onStarted,
    isDrawingActive,
    toggleScroll,
    onLog,
  } = props;

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

    setTimeout(() => {
      // not to affect render
      writeFile(path, result.svgString);
    }, 500);
  };

  const writeFile = async (path: string, svg: string) => {
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
  };

  const toggleScrollRef = useRef(toggleScroll);

  toggleScrollRef.current = toggleScroll;

  const handleToggle = () => {
    !isDrawingActive && scrollToEnd();

    toggleScrollRef.current(isDrawingActive);
  };

  const enableScroll = useDebouncedCallback(() => {
    toggleScrollRef.current(true);
  }, SCROLL_ENABLING_DELAY);

  const disableScroll = () => toggleScrollRef.current(false);

  const onCanvasTouchStart = (e: GestureResponderEvent) => {
    e.stopPropagation();

    runOnIOS(() => {
      disableScroll();
    });
  };

  const onCanvasTouchEnd = () => {
    runOnIOS(() => {
      enableScroll();
    });
  };

  useEffect(() => {
    if (IS_ANDROID) {
      if (isAreaScrollable) {
        enableScroll();
      } else {
        disableScroll();
      }
    }
  }, [isAreaScrollable, enableScroll]);

  return (
    <Box
      {...props}
      onTouchStart={() => {
        enableScroll.flush();
      }}
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

      {IS_ANDROID && isAreaScrollable && (
        <TouchableOpacity onPress={handleToggle}>
          <Center mb={16}>
            <Text color={isDrawingActive ? '$red' : '$primary'} fontSize={18}>
              {isDrawingActive
                ? 'Tap here to stop drawing' // @todo add translations after confirmation
                : 'Tap here to start drawing'}
            </Text>
          </Center>
        </TouchableOpacity>
      )}

      {!!width && (
        <XStack
          jc="center"
          onTouchStart={onCanvasTouchStart}
          onTouchEnd={onCanvasTouchEnd}
        >
          {!!backgroundImageUrl && (
            <CachedImage
              source={backgroundImageUrl}
              style={{ position: 'absolute', width, height: width }}
              resizeMode="contain"
            />
          )}

          <DrawingBoard
            value={value.lines}
            isDrawingActive={isDrawingActive || IS_IOS}
            onResult={onResult}
            onStarted={onStarted}
            width={width}
            onLog={onLog}
          />
        </XStack>
      )}
    </Box>
  );
};

export default DrawingTest;
