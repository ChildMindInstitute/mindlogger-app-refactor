import { FC, memo, PropsWithChildren, useMemo } from 'react';
import { StyleSheet, ImageBackground as RNImageBackground } from 'react-native';

import { XStackProps } from '@tamagui/stacks';

import { useCachedImage } from '@app/shared/lib';
import { cloudBackground } from '@assets/images';

type Props = {
  uri?: string;
} & XStackProps;

const ImageBackground: FC<PropsWithChildren<Props>> = ({ children, uri }) => {
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

export default memo(ImageBackground);
