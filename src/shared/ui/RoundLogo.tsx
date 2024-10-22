/* eslint-disable react-native/no-inline-styles */
import React, { FC } from 'react';
import { StyleSheet, ImageStyle, AccessibilityProps } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { Text } from '@tamagui/core';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { Box } from './base';
import { colors } from '../lib/constants/colors';

type Props = {
  letter?: string;
  imageUri?: string | null;
  imageStyle?: ImageStyle;
  size?: number;
};

const getImageUrl = (url: string): string => {
  if (url.endsWith('.svg')) {
    // todo - remove later if unnecessary
    return url.replace('.svg', '.jpg');
  }
  return url;
};

export const RoundLogo: FC<Props & AccessibilityProps> = ({
  accessibilityLabel,
  imageUri,
  imageStyle,
  letter,
  size = 64,
}) => {
  if (imageUri) {
    return (
      <Box
        accessibilityLabel={accessibilityLabel}
        style={[getStyles(size).container]}
      >
        <CachedImage
          style={[getStyles(size).image, imageStyle]}
          source={getImageUrl(imageUri)}
        />
      </Box>
    );
  }

  if (!letter) {
    return <Box />;
  }

  return (
    <Box
      accessibilityLabel="round-logo-default"
      w={size}
      h={size}
      jc="center"
      ai="center"
    >
      <Svg height={size} width={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2={size} y2={size}>
            <Stop offset="0" stopColor={colors.blue2} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.lightGreen} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#grad)" />
      </Svg>

      <Text fontSize={size / 2} color="$whiteTsp" fontWeight="700">
        {letter}
      </Text>
    </Box>
  );
};

const getStyles = (size: number) =>
  StyleSheet.create({
    image: {
      width: size,
      height: size,
      resizeMode: 'cover',
      borderRadius: size / 2,
    },
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
    },
  });
