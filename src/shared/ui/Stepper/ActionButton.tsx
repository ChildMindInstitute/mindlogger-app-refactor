import { PropsWithChildren } from 'react';

import { Button, BoxProps } from '@shared/ui';

type Props = PropsWithChildren<{
  onPress: () => void;
  type?: 'submit' | 'flat';
  accessibilityLabel: string;
  fontWeight?: string;
}> &
  BoxProps;

const ActionButton = ({
  onPress,
  type = 'submit',
  accessibilityLabel,
  children,
}: Props) => {
  return (
    <Button
      onPress={onPress}
      px={10}
      w="100%"
      bg={type === 'submit' ? '$primary' : '$white'}
      textColor={type === 'submit' ? '$white' : '$primary'}
      borderWidth={type === 'submit' ? 0 : 1}
      fontWeight={type === 'submit' ? 'bold' : 'normal'}
      fontSize={15}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
