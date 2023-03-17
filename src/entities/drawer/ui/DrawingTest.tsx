import { FC, useState } from 'react';

import { Box, BoxProps, Image, Text, XStack } from '@app/shared/ui';

import DrawingBoard from './DrawingBoard';
import { DrawLine, DrawResult } from '../lib';

const RectPadding = 15;

type Props = {
  initialLines: Array<DrawLine>;
  instruction: string | null;
  imageUrl: string | null;
  backgroundImageUrl: string | null;
  onStarted: () => void;
  onResult: (result: DrawResult) => void;
} & BoxProps;

const DrawingTest: FC<Props> = props => {
  const [width, setWidth] = useState<number | null>(null);

  const {
    initialLines,
    backgroundImageUrl,
    imageUrl,
    instruction,
    onStarted,
    onResult,
  } = props;

  return (
    <Box
      {...props}
      onLayout={x => {
        setWidth(x.nativeEvent.layout.width - RectPadding * 2);
      }}
    >
      {!!imageUrl && (
        <XStack jc="center">
          <Image
            src={imageUrl}
            width={300}
            height={300}
            p={20}
            pb={0}
            mb={20}
            resizeMode="contain"
          />
        </XStack>
      )}

      {!!width && (
        <XStack jc="center">
          {!!backgroundImageUrl && (
            <Image
              src={backgroundImageUrl}
              position="absolute"
              width={width}
              height={width}
              resizeMode="contain"
            />
          )}

          <DrawingBoard
            initialLines={initialLines}
            onResult={onResult}
            onStarted={onStarted}
            width={width}
          />
        </XStack>
      )}

      {!!instruction && (
        <Text mt={20} p={RectPadding} pt={0}>
          {instruction}
        </Text>
      )}
    </Box>
  );
};

export default DrawingTest;
