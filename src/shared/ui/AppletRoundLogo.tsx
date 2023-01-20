/* eslint-disable react-native/no-inline-styles */
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { Text } from '@tamagui/core';
import { CachedImage } from 'react-native-img-cache';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import { Applet } from '@entities/applet/lib';

import { colors } from '../lib';

import { Box } from '.';

declare module 'react-native-svg' {
  interface LinearGradientProps {
    children: JSX.Element | JSX.Element[];
  }
}

type Props = {
  applet: Applet;
  size?: number;
};

const getImageUrl = (url: string): string => {
  if (url.endsWith('.svg')) {
    // todo - remove if unnecessary
    return url.replace('.svg', '.jpg');
  }
  return url;
};

const AppletRoundLogo: FC<Props> = ({ applet, size = 64 }) => {
  if (applet.image) {
    return (
      <CachedImage
        style={getStyles(size).image}
        source={{ uri: getImageUrl(applet.image) }}
      />
    );
  }

  return (
    <Box w={size} h={size} jc="center" ai="center">
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
        {applet.name[0].toUpperCase()}
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
  });

export default AppletRoundLogo;
