import { View } from 'react-native';

import { styled } from '@tamagui/core';
import { SvgProps } from 'react-native-svg';

import { Text } from './Text';
import { colors } from '../lib/constants/colors';

const getFillForVariant = (
  variant: React.ComponentProps<typeof StyledChip>['variant'],
) => {
  switch (variant) {
    case 'warning':
      return '#D9730D';
    case 'primary':
    default:
      return colors.alertInfoIcon;
  }
};

const StyledChip = styled(View, {
  alignItems: 'center',
  borderRadius: 4,
  flexDirection: 'row',
  gap: 4,
  name: 'Chip',
  px: 8,
  py: 4,

  variants: {
    variant: {
      primary: {
        backgroundColor: '$alertInfoBg',
      },
      warning: {
        backgroundColor: 'rgba(217, 115, 13, 0.30)',
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
    {Icon && <Icon aria-hidden fill={getFillForVariant(variant)} />}
    {children && (
      <Text fontSize={12} fontWeight="300" lineHeight={20}>
        {children}
      </Text>
    )}
  </StyledChip>
);
