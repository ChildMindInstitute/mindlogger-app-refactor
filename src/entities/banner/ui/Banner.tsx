import { ReactNode, useEffect, useState } from 'react';

import { useAppState } from '@react-native-community/hooks';
import { StackStyle } from '@tamagui/core';
import { XStackProps } from '@tamagui/stacks';

import { palette } from '@app/shared/lib/constants/palette';
import { Box, XStack } from '@app/shared/ui/base';
import { CloseIcon } from '@app/shared/ui/icons';
import { Text } from '@app/shared/ui/Text';

import { BANNER_ICONS, BANNER_BG_COLORS } from '../lib/constants';

export type BannerProps = {
  /**
   * Duration in milliseconds after which the banner will be automatically closed.
   * Provide `null` to disable auto-closing.
   * @default 5000
   */
  duration?: number | null;
  /** @default !!onClose */
  hasCloseButton?: boolean;
  onClose?: (reason?: 'timeout' | 'manual') => void;
  /** @default 'success' */
  severity?: 'success' | 'error' | 'warning' | 'info';
  icon?: ReactNode;
  color?: string;
} & XStackProps &
  Record<string, unknown>; // Custom banner props

export const Banner = ({
  children,
  duration = 5000,
  onClose,
  hasCloseButton = !!onClose,
  severity = 'success',
  color = palette.on_surface,
  backgroundColor = BANNER_BG_COLORS[severity],
  icon = BANNER_ICONS[severity],
  ...rest
}: BannerProps) => {
  const [isPressing, setIsPressing] = useState(false);
  const state = useAppState();

  // Close banner on timeout only while window is focused & banner not pressed
  // (common a11y alert behavior)
  useEffect(() => {
    if (!duration || !onClose || isPressing || state !== 'active') return;

    const timeoutId = setTimeout(() => onClose?.('timeout'), duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [duration, onClose, isPressing, state]);

  return (
    <XStack
      alignItems="center"
      px={16}
      py={12}
      gap={12}
      backgroundColor={backgroundColor}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
      aria-label={`${severity}-banner`}
      {...rest}
    >
      {icon}
      <Text color={color} fontSize={16} lineHeight={20} flex={1}>
        {children}
      </Text>
      {hasCloseButton && !!onClose && (
        <Box
          m={2}
          p={10}
          onPress={() => onClose?.('manual')}
          borderRadius={100}
          pressStyle={pressStyle}
          aria-label="banner-close"
        >
          <CloseIcon color={color} size={18} />
        </Box>
      )}
    </XStack>
  );
};

const pressStyle: StackStyle = {
  backgroundColor: palette.on_surface_alpha12,
};
