import { ElementType, FC } from 'react';

import { XStackProps } from '@tamagui/stacks';

import { XStack } from './base';
import { ArrowRightIcon } from './icons';
import { Text } from './Text';
import { colors } from '../lib/constants/colors';

type Props = {
  onPress: () => void;
  title: string;
  rightIcon?: ElementType;
} & XStackProps;

const pressStyle = {
  opacity: 0.5,
};

export const RowButton: FC<Props> = props => {
  const {
    onPress,
    title,
    rightIcon: RightIcon = ArrowRightIcon,
    ...boxProps
  } = props;

  return (
    <XStack
      onPress={onPress}
      bg="transparent"
      py="$2.5"
      px="$2"
      jc="space-between"
      ai="center"
      bbc="$lightGrey"
      bbw={1}
      pressStyle={pressStyle}
      {...boxProps}
    >
      <Text>{title}</Text>
      <RightIcon color={colors.mediumGrey} size={15} />
    </XStack>
  );
};
