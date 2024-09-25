import { FC, PropsWithChildren } from 'react';

import { YStack } from '@tamagui/stacks';

import { BoxProps } from '@app/shared/ui/base';
import { ImageBackground } from '@app/shared/ui/ImageBackground';

type FlexContainerProps = PropsWithChildren<BoxProps>;

export type SubComponentProps = {
  onPressDone?: () => void;
};

export const SubScreenContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ImageBackground>
      <YStack flex={1} px={20} gap={20}>
        {children}
      </YStack>
    </ImageBackground>
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
