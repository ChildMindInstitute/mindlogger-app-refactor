import { FC } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { AnimatedTouchable } from '@app/shared/ui/AnimatedTouchable';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { CardThumbnail } from '@app/shared/ui/CardThumbnail';
import { RoundTextNotification } from '@app/shared/ui/RoundTextNotification';
import { Text } from '@app/shared/ui/Text';

import { Applet } from '../lib/types';

type Props = {
  applet: Applet;
  disabled: boolean;
  onPress?: (...args: any[]) => void;
  thumbnailColor?: string;
};

export const AppletCard: FC<Props & AccessibilityProps> = ({
  applet,
  disabled,
  onPress,
  thumbnailColor,
  accessibilityLabel,
}) => {
  const theme = applet.theme;

  return (
    <AnimatedTouchable
      aria-label={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      style={{
        borderRadius: 16,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <YStack position="relative" p={16} gap={8}>
        <XStack jc="space-between" ai="flex-start" mb={8}>
          <CardThumbnail
            aria-label="applet_logo-image"
            imageUri={applet.image}
            letter={applet.displayName[0].toUpperCase()}
            bg={thumbnailColor}
          />

          {!!theme?.logo && (
            <CachedImage style={styles.smallLogo} source={theme.logo} />
          )}
        </XStack>

        <Text
          flex={1}
          fontWeight="700"
          fontSize={22}
          lineHeight={28}
          aria-label="applet_name-text"
        >
          {applet.displayName}
        </Text>

        {!!applet.description && (
          <Text
            aria-label="applet_description-text"
            fontSize={16}
            fontWeight="400"
            lineHeight={24}
          >
            {applet.description}
          </Text>
        )}

        {!!applet.numberOverdue && (
          <Box position="absolute" top={-4} right={-4}>
            <RoundTextNotification
              aria-label="applet_number_overdue-text"
              text={applet.numberOverdue.toString()}
            />
          </Box>
        )}
      </YStack>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  smallLogo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
});
