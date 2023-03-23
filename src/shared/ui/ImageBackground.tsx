import React, { FC, PropsWithChildren, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled } from '@tamagui/core';
import { XStack, XStackProps } from '@tamagui/stacks';
import Animated, { FadeIn } from 'react-native-reanimated';

import ActivityIndicator from './ActivityIndicator';

type Props = {
  uri?: string;
  loader?: JSX.Element;
} & XStackProps;

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80';

const AnimatedView = styled(Animated.View, {
  flex: 1,
});

const ImageBackground: FC<PropsWithChildren<Props>> = ({
  children,
  loader,
  uri = DEFAULT_IMAGE,
  ...styledProps
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState(uri);

  const loadingFinished = () => setIsLoading(false);
  const onError = () => {
    setSource(DEFAULT_IMAGE);
  };

  return (
    <XStack flex={1} bg="$white" {...styledProps}>
      <CachedImage
        style={[StyleSheet.absoluteFill]}
        source={source}
        resizeMode="cover"
        sourceAnimationDuration={500}
        onLoadEnd={loadingFinished}
        loadingImageComponent={() => (
          <ActivityIndicator size="large" color="$secondary" />
        )}
        onError={onError}
      />

      {loader && isLoading && loader}

      {!isLoading && (
        <AnimatedView entering={FadeIn.duration(300)}>{children}</AnimatedView>
      )}
    </XStack>
  );
};

export default ImageBackground;
