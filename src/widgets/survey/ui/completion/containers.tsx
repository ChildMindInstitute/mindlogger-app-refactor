import { FC, PropsWithChildren } from 'react';

import { YStack, YStackProps } from '@tamagui/stacks';

type FlexContainerProps = PropsWithChildren<YStackProps>;

export type SubComponentProps = {
  onPressDone?: () => void;
};

export const SubScreenContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <YStack flex={1} px={16}>
      {children}
    </YStack>
  );
};

export const FlexContainer: FC<FlexContainerProps> = ({
  children,
  ...boxProps
}) => {
  return (
    <YStack flex={1} alignItems="center" gap={20} {...boxProps}>
      {children}
    </YStack>
  );
};
