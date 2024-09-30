import { FC, memo, PropsWithChildren, useMemo } from 'react';
import { StyleSheet, ImageBackground as RNImageBackground } from 'react-native';

import { XStackProps } from '@tamagui/stacks';

import { cloudBackground } from '@assets/images';

import { useCachedImage } from '../lib/hooks/useCachedImage';

type Props = {
  uri?: string;
} & XStackProps;

const ImageBackgroundView: FC<PropsWithChildren<Props>> = ({
  children,
  uri,
}) => {
  const imageSource = useCachedImage(uri);

  const source = useMemo(
    () =>
      imageSource
        ? { uri: imageSource, cache: 'force-cache' }
        : cloudBackground,
    [imageSource],
  );

  return (
    <RNImageBackground source={source} style={[StyleSheet.absoluteFill]}>
      {children}
    </RNImageBackground>
  );
};

export const ImageBackground = memo(ImageBackgroundView);
