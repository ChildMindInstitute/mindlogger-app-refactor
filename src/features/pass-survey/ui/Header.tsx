import { PropsWithChildren } from 'react';

import { XStack } from '@tamagui/stacks';

import { BoxProps } from '@shared/ui';

type Props = PropsWithChildren<BoxProps>;

function Header({ children, ...boxProps }: Props) {
  return (
    <XStack {...boxProps} w="100%" alignItems="center">
      {children}
    </XStack>
  );
}

export default Header;
