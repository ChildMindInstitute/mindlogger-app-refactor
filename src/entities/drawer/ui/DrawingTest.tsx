import { FC, useState } from 'react';

import { Box, BoxProps, Image, XStack } from '@app/shared/ui';

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
