/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, XStack } from '@app/shared/ui/base';

import { DrawingTestProps } from './DrawingTest';
import { DrawResult } from '../../lib/types/draw';
import { getDefaultSvgFileManager } from '../../lib/utils/svgFileManagerInstance';
import { DrawingBoard } from '../DrawingBoard';

const RectPadding = 15;

export const DrawingTestLegacyLayout: FC<DrawingTestProps> = props => {
  const width = props.dimensions.width - RectPadding * 2;

  const { value, backgroundImageUrl, imageUrl, onLog } = props;

  const onResult = async (result: DrawResult) => {
    const fileName = value.fileName;

    const fileMeta = getDefaultSvgFileManager().getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  return (
    <Box {...props}>
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

          <XStack width={width} height={width}>
            <DrawingBoard
              value={value.lines}
              onResult={onResult}
              width={width}
              onLog={onLog}
            />
          </XStack>
        </XStack>
      )}
    </Box>
  );
};
