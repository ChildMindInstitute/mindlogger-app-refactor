/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, BoxProps, XStack } from '@app/shared/ui';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawResult } from '../lib';

const RectPadding = 15;

type Props = {
  value: Array<DrawLine>;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
} & BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);

  const { value, backgroundImageUrl, imageUrl, onStarted, onResult } = props;

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
            value={value}
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
