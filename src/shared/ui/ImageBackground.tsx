import { FC, memo, PropsWithChildren, useMemo } from 'react';
import {
  StyleSheet,
  ImageBackground as RNImageBackground,
  ImageSourcePropType,
} from 'react-native';

import { XStackProps } from '@tamagui/stacks';

import { useCachedImage } from '../lib/hooks/useCachedImage';

type Props = {
  uri?: string;
} & XStackProps;

const ImageBackgroundView: FC<PropsWithChildren<Props>> = ({
  children,
  uri,
}) => {
  const imageSource = useCachedImage(uri);

  const source: ImageSourcePropType | undefined = useMemo(
    () =>
      imageSource ? { uri: imageSource, cache: 'force-cache' } : undefined,
    [imageSource],
  );

  return (
    <RNImageBackground source={source} style={[StyleSheet.absoluteFill]}>
      {children}
    </RNImageBackground>
  );
};

export const ImageBackground = memo(ImageBackgroundView);
