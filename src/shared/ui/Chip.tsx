import { View } from 'react-native';

import { styled } from '@tamagui/core';
import { SvgProps } from 'react-native-svg';

import { XStack } from './base';
import { Text } from './Text';
import { palette } from '../lib/constants/palette';

const getFillForVariant = (
  variant: React.ComponentProps<typeof StyledChip>['variant'],
) => {
  switch (variant) {
    case 'warning':
      return palette.warning;
    case 'error':
      return palette.error;
    case 'primary':
    default:
      return palette.info;
  }
};

const StyledChip = styled(View, {
  alignItems: 'center',
  borderRadius: 8,
  flexDirection: 'row',
  name: 'Chip',
  px: 12,
  py: 6,

  variants: {
    variant: {
      primary: {
        backgroundColor: '$secondary_container',
      },
      error: {
        backgroundColor: '$error_container',
      },
      warning: {
        backgroundColor: '$warning_container',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
} as const);

export const Chip = ({
  children,
  icon: Icon,
  variant = 'primary',
  ...otherProps
}: React.ComponentProps<typeof StyledChip> & {
  icon?: React.ComponentType<SvgProps>;
}) => (
  <StyledChip variant={variant} {...otherProps}>
    {Icon && (
      <XStack jc="center" w={18} ml={-4} mr={8}>
        <Icon aria-hidden fill={getFillForVariant(variant)} />
      </XStack>
    )}

    {!!children && (
      <Text fontSize={14} lineHeight={20} letterSpacing={0.1}>
        {children}
      </Text>
    )}
  </StyledChip>
);
