import { FC, PropsWithChildren, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CacheManager } from '@georstat/react-native-image-cache';
import { PortalProvider } from '@tamagui/portal';
import { Dirs } from 'react-native-file-access';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LocalizationProvider } from '@app/entities/localization';

import NavigationProvider from './NavigationProvider';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import SplashProvider from './SplashProvider';
import SystemBootUpProvider from './SystemBootUpProvider';
import TamaguiProvider from './TamaguiProvider';
import ToastProvider from './ToastProvider';

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 0,
  sourceAnimationDuration: 1000,
  thumbnailAnimationDuration: 1000,
};

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBootingUp, setIsBootingUp] = useState(true);

  return (
    <GestureHandlerRootView style={styles.gestureHandlerView}>
      <SystemBootUpProvider onLoadingFinished={() => setIsBootingUp(false)}>
        <ReduxProvider>
          <ReactQueryProvider>
            <LocalizationProvider>
              <TamaguiProvider>
                <NavigationProvider>
                  <ToastProvider>
                    <PortalProvider>
                      <SplashProvider isLoading={isBootingUp}>
                        {children}
                      </SplashProvider>
                    </PortalProvider>
                  </ToastProvider>
                </NavigationProvider>
              </TamaguiProvider>
            </LocalizationProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </SystemBootUpProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandlerView: {
    flex: 1,
  },
});

export default AppProvider;
