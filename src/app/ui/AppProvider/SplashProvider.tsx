import { PropsWithChildren } from 'react';

import { Box, Splash } from '@shared/ui';

type Props = PropsWithChildren<{
  isLoading: boolean;
}>;

function SplashProvider({ isLoading, children }: Props) {
  return (
    <Box flex={1}>
      {isLoading ? <Box flex={1} /> : children}
      {isLoading ? <Splash /> : <></>}
    </Box>
  );
}

export default SplashProvider;
