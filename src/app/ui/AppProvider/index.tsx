import { FC, Suspense, PropsWithChildren } from 'react';

import { CacheManager } from '@georstat/react-native-image-cache';
import { PortalProvider } from '@tamagui/portal';
import { Dirs } from 'react-native-file-access';

import NavigationProvider from './NavigationProvider';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import SplashProvider from './SplashProvider';
import TamaguiProvider from './TamaguiProvider';

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 0,
  sourceAnimationDuration: 1000,
  thumbnailAnimationDuration: 1000,
};

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SplashProvider>
      <ReduxProvider>
        <ReactQueryProvider>
          <TamaguiProvider>
            <NavigationProvider>
              <PortalProvider>
                <Suspense>{children}</Suspense>
              </PortalProvider>
            </NavigationProvider>
          </TamaguiProvider>
        </ReactQueryProvider>
      </ReduxProvider>
    </SplashProvider>
  );
};

export default AppProvider;
