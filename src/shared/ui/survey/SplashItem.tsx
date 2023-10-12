import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

type Props = {
  config: {
    imageUrl: string;
  };
};

const styles = StyleSheet.create({
  image: { height: '100%', width: '100%' },
});

const SplashItem: FC<Props> = ({ config }) => {
  const { imageUrl } = config;

  return (
    <CachedImage
      data-test="splash-image"
      resizeMode="contain"
      style={styles.image}
      source={imageUrl}
    />
  );
};

export default SplashItem;
