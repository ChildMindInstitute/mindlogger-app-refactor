import { FC, PropsWithChildren } from 'react';

import { YStack } from '@tamagui/stacks';

import { ImageBackground } from '@shared/ui';
import { BoxProps } from '@shared/ui';

type FlexContainerProps = PropsWithChildren<BoxProps>;

export type SubComponentProps = {
  onPressDone?: () => void;
};
const SubScreenContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ImageBackground>
      <YStack flex={1} px={20} gap={20}>
        {children}
      </YStack>
    </ImageBackground>
  );
};

const FlexContainer: FC<FlexContainerProps> = ({ children, ...boxProps }) => {
  return (
    <YStack flex={1} alignItems="center" gap={20} {...boxProps}>
      {children}
    </YStack>
  );
};

export { SubScreenContainer, FlexContainer };
