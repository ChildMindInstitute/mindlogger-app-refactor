import { Children, PropsWithChildren, ReactNode, useMemo } from 'react';

import { XStack, YStack } from '../base';
import { XStackProps } from '@tamagui/stacks';

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
      <YStack flex={1} alignItems="flex-start">
        {buttons[0]}
      </YStack>

      <YStack flex={1} alignItems="center">
        {buttons[1]}
      </YStack>

      <YStack flex={1} alignItems="flex-end">
        {buttons[2]}
      </YStack>
    </XStack>
  );
}
