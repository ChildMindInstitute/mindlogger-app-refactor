import React, { FC } from 'react';
import { StyleSheet, AccessibilityProps } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { Box, BoxProps } from './base';
import { Text } from './Text';

type Props = BoxProps & {
  letter?: string;
  imageUri?: string | null;
  size?: number;
};

const getImageUrl = (url: string): string => {
  if (url.endsWith('.svg')) {
    // todo - remove later if unnecessary
    return url.replace('.svg', '.jpg');
  }
  return url;
};

export const CardThumbnail: FC<Props & AccessibilityProps> = ({
  imageUri,
  letter,
  size = 72,
  ...props
}) => {
  if (imageUri || letter) {
    let content: React.ReactNode;

    if (imageUri) {
      const styles = getStyles(size);

      content = (
        <CachedImage style={styles.image} source={getImageUrl(imageUri)} />
      );
    } else if (letter) {
      content = (
        <Box aria-label="round-logo-default" flex={1} jc="center" ai="center">
          <Text fontSize={(size * 32) / 72} color="$on_primary">
            {letter}
          </Text>
        </Box>
      );
    }

    return (
      <Box
        w={size}
        h={size}
        br={8}
        overflow="hidden"
        {...props}
        style={imageUri ? { backgroundColor: 'transparent' } : undefined}
      >
        {content}
      </Box>
    );
  }

  return null;
};

const getStyles = (size: number) =>
  StyleSheet.create({
    image: {
      width: size,
      height: size,
      resizeMode: 'cover',
    },
  });
