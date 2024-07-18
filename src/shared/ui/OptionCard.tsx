import { PropsWithChildren, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { styled } from '@tamagui/core';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors } from '@app/shared/lib';

import { Box, BoxProps, XStack, YStack } from './base';
import Text from './Text';

type Props = {
  imageUrl: string | null;
  textColor?: string;
  onPress: () => void;
  renderLeftIcon?: () => JSX.Element | null;
  renderRightIcon?: () => JSX.Element | null;
} & BoxProps;

const CardWrapper = styled(YStack, {
  minHeight: 188,
  borderWidth: 2,
  borderRadius: 12,
  borderColor: colors.lighterGrey7,
  backgroundColor: colors.white,
});

const Backdrop = styled(Box, {
  flex: 1,
  backgroundColor: 'rgba(26, 28, 30, 0.12))',
});

function OptionCard({
  children,

  imageUrl,
  textColor = colors.onSurface,

  onPress,
  renderLeftIcon,
  renderRightIcon,

  ...styledProps
}: PropsWithChildren<Props>) {
  const [backdropShown, setBackdropShown] = useState(false);

  return (
    <CardWrapper
      onPress={onPress}
      onPressIn={() => setBackdropShown(true)}
      onPressOut={() => setBackdropShown(false)}
      p={12}
      {...styledProps}
    >
      {backdropShown && (
        <Animated.View
          style={StyleSheet.absoluteFillObject}
          entering={FadeIn.duration(200).springify()}
          exiting={FadeOut.duration(200).springify()}
        >
          <Backdrop />
        </Animated.View>
      )}

      {imageUrl && (
        <Box alignItems="center" mb={12}>
          <Box w={124} h={124} overflow="hidden" br={8}>
            <CachedImage
              resizeMode="contain"
              accessibilityLabel="option-card-image"
              style={styles.image}
              source={imageUrl}
            />
          </Box>
        </Box>
      )}

      <XStack flex={1} alignItems="center" justifyContent="space-between">
        {renderLeftIcon?.()}

        <Text
          accessibilityLabel="radio-option-text"
          fontSize={18}
          fontFamily="Atkinson Hyperlegible Regular"
          color={textColor}
          numberOfLines={3}
          flex={1}
          pr={renderRightIcon ? 0 : 8}
        >
          {children}
        </Text>

        {renderRightIcon?.()}
      </XStack>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});

export default OptionCard;
