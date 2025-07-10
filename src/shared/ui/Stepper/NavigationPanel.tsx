import { Children, PropsWithChildren, ReactNode, useMemo } from 'react';

import { XStackProps } from '@tamagui/stacks';

import { XStack } from '../base';

type Props = PropsWithChildren<XStackProps>;

export function NavigationPanel({ children, ...styledProps }: Props) {
  const buttons = useMemo(() => {
    const allChildren: ReactNode[] = [];

    Children.forEach(children, child => {
      allChildren.push(child);
    });

    return allChildren;
  }, [children]);

  return (
    <XStack justifyContent="space-between" {...styledProps}>
      <XStack flex={1} justifyContent="flex-start">
        {buttons[0]}
      </XStack>

      <XStack flex={1} justifyContent="center">
        {buttons[1]}
      </XStack>

      <XStack flex={1} justifyContent="flex-end">
        {buttons[2]}
      </XStack>
    </XStack>
  );
}
