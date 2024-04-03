import { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { XStack, YStack } from '@app/shared/ui';

import { DrawingTestProps } from './DrawingTest';
import { DrawResult, SvgFileManager } from '../../lib';
import DrawingBoard from '../DrawingBoard';

type Ratio = NonNullable<DrawingTestProps['ratio']>;

type Props = DrawingTestProps & {
  ratio: Ratio;
};

const DrawingTestWithRatio: FC<Props> = props => {
  const [canvasWidth, setCanvasWidth] = useState<number>(0);

  const { value, backgroundImageUrl, imageUrl, onLog, ratio } = props;

  const onResult = async (result: DrawResult) => {
    let fileName = value.fileName;

    const fileMeta = SvgFileManager.getFileMeta(fileName);

    result.fileName = fileMeta.fileName;
    result.type = fileMeta.type;
    result.uri = fileMeta.uri;

    props.onResult(result);
  };

  return (
    <YStack {...props} alignItems="center" flex={1}>
      {!!imageUrl && (
        <XStack jc="center" flex={ratio.exampleImage} mb={20}>
          <CachedImage
            source={imageUrl}
            style={styles.example}
            resizeMode="contain"
          />
        </XStack>
      )}

      <XStack
        jc="center"
        flex={ratio.canvas}
        onLayout={e => {
          if (!canvasWidth) {
            setCanvasWidth(e.nativeEvent.layout.height);
          }
        }}
        width={canvasWidth ? canvasWidth : 'auto'}
      >
        {!!backgroundImageUrl && (
          <CachedImage
            source={backgroundImageUrl}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
        )}

        <DrawingBoard
          value={value.lines}
          onResult={onResult}
          width={canvasWidth}
          onLog={onLog}
        />
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  example: {
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default DrawingTestWithRatio;
