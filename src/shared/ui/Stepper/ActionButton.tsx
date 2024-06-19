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
  ...boxProps
}: Props) => {
  return (
    <Button
      onPress={onPress}
      px={10}
      py={13}
      maxWidth={200}
      bg={type === 'submit' ? '$primary' : '$white'}
      textStyles={{
        textColor: type === 'submit' ? '$white' : '$primary',
        fontWeight: type === 'submit' ? 'bold' : 'normal',
        fontSize: 13,
      }}
      borderWidth={type === 'submit' ? 0 : 1}
      borderColor="$grey"
      accessibilityLabel={accessibilityLabel}
      {...boxProps}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
