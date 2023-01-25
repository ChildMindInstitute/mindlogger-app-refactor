import { FC, Suspense, PropsWithChildren } from 'react';

import { CacheManager } from '@georstat/react-native-image-cache';
import { NavigationContainer } from '@react-navigation/native';
import { Dirs } from 'react-native-file-access';

import CommonEvents from './CommonEvents';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
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
    <ReduxProvider>
      <ReactQueryProvider>
        <TamaguiProvider>
          <NavigationContainer>
            <CommonEvents>
              <Suspense>{children}</Suspense>
            </CommonEvents>
          </NavigationContainer>
        </TamaguiProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
