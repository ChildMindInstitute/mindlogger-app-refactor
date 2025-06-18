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
};

export const AppletCard: FC<Props & AccessibilityProps> = ({
  applet,
  disabled,
  onPress,
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
      <YStack position="relative" p={16} gap={16}>
        <CardThumbnail
          accessibilityLabel="applet_logo-image"
          imageUri={applet.image}
        />

        <YStack flex={1} gap={8}>
          <XStack jc="space-between">
            <Text
              flex={1}
              fontWeight="700"
              fontSize={22}
              lineHeight={28}
              accessibilityLabel="applet_name-text"
            >
              {applet.displayName}
            </Text>

            {!!theme?.logo && (
              <CachedImage style={styles.smallLogo} source={theme.logo} />
            )}
          </XStack>

          {!!applet.description && (
            <Text
              accessibilityLabel="applet_description-text"
              fontSize={16}
              fontWeight="400"
              lineHeight={24}
            >
              {applet.description}
            </Text>
          )}
        </YStack>

        {!!applet.numberOverdue && (
          <Box position="absolute" top={-14} right={-14}>
            <RoundTextNotification
              accessibilityLabel="applet_number_overdue-text"
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
    width: 60,
    height: 30,
    resizeMode: 'contain',
  },
});
