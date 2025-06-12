import { FC, PropsWithChildren } from 'react';

import { YStack, YStackProps } from '@tamagui/stacks';

import { bannerActions } from '@app/entities/banner/model/slice';
import { colors } from '@app/shared/lib/constants/colors';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { ImageBackground } from '@app/shared/ui/ImageBackground';

type FlexContainerProps = PropsWithChildren<YStackProps>;

export type SubComponentProps = {
  onPressDone?: () => void;
};

export const SubScreenContainer: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  useOnFocus(() => {
    // Match <ImageBackground> raster image top pixel color
    dispatch(bannerActions.setBannersBg(colors.lightGrey4));
  });

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
