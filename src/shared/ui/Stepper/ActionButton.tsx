import { PropsWithChildren } from 'react';

import { BoxProps } from '../base';
import { Button } from '../Button';

type Props = PropsWithChildren<{
  onPress: () => void;
  type?: 'submit' | 'flat';
  accessibilityLabel: string;
  fontWeight?: string;
}> &
  BoxProps;

export const ActionButton = ({
  onPress,
  type = 'submit',
  accessibilityLabel,
  children,
  ...boxProps
}: Props) => {
  return (
    <Button
      onPress={onPress}
      px={24}
      py={12}
      maxWidth={200}
      bg={type === 'submit' ? '$primary' : '$surface'}
      textProps={{
        color: type === 'submit' ? '$on_primary' : '$on_surface',
        fontWeight: type === 'submit' ? '700' : '400',
      }}
      borderWidth={type === 'submit' ? 0 : 1}
      borderColor="$outline"
      aria-label={accessibilityLabel}
      {...boxProps}
    >
      {children}
    </Button>
  );
};
