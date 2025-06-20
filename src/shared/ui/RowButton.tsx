import { ElementType, FC } from 'react';

import { XStackProps } from '@tamagui/stacks';

import { XStack } from './base';
import { ChevronRightIcon } from './icons';
import { Text } from './Text';
import { palette } from '../lib/constants/palette';

type Props = {
  onPress: () => void;
  title: string;
  rightIcon?: ElementType;
  isSelected?: boolean;
} & XStackProps;

const pressStyle = {
  opacity: 0.5,
};

export const RowButton: FC<Props> = props => {
  const {
    onPress,
    title,
    rightIcon: RightIcon = ChevronRightIcon,
    isSelected,
    ...boxProps
  } = props;

  return (
    <XStack
      onPress={onPress}
      bg={isSelected ? '$secondary_container' : 'transparent'}
      p={12}
      jc="space-between"
      ai="center"
      bbc="$surface_variant"
      bbw={1}
      pressStyle={pressStyle}
      {...boxProps}
    >
      <Text
        color={isSelected ? palette.on_secondary_container : palette.on_surface}
      >
        {title}
      </Text>
      <RightIcon
        color={isSelected ? palette.on_secondary_container : palette.on_surface}
        size={16}
      />
    </XStack>
  );
};
