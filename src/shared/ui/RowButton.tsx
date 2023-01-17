import { FC, ElementType } from 'react';

import { colors } from '@shared/lib';
import { XStack, BoxProps, Text, ArrowRightIcon } from '@shared/ui';

type Props = {
  onPress: () => void;
  title: string;
  rightIcon?: ElementType;
} & BoxProps;

const RowButton: FC<Props> = props => {
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
      {...boxProps}>
      <Text>{title}</Text>
      <RightIcon color={colors.mediumGrey} size={15} />
    </XStack>
  );
};

export default RowButton;
