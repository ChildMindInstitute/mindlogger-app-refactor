import { PropsWithChildren } from 'react';

import { Box } from '@app/shared/ui/base';
import { SplashScreen } from '@app/shared/ui/Splash';

type Props = PropsWithChildren<{
  isLoading: boolean;
}>;

export function SplashProvider({ isLoading, children }: Props) {
  return (
    <Box flex={1}>
      {isLoading ? <Box flex={1} /> : children}
      {isLoading ? <SplashScreen /> : <></>}
    </Box>
  );
}
