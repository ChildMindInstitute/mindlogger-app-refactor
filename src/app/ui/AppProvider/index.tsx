import { FC, PropsWithChildren, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CacheManager } from '@georstat/react-native-image-cache';
import { PortalProvider } from '@tamagui/portal';
import { Dirs } from 'react-native-file-access';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LocalizationProvider } from '@app/entities/localization';
import { AnalyticsService, Logger, MixEvents } from '@app/shared/lib';

import AnalyticsProvider from './AnalyticsProvider';
import NavigationProvider from './NavigationProvider';
import ReactQueryProvider from './ReactQueryProvider';
import ReduxProvider from './ReduxProvider';
import SplashProvider from './SplashProvider';
import StorageMigrationProvider from './StorageMigrationProvider';
import SystemBootUpProvider from './SystemBootUpProvider';
import TamaguiProvider from './TamaguiProvider';
import ToastProvider, {
  ToastProvider_NewImplementation,
} from './ToastProvider';

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 0,
  sourceAnimationDuration: 1000,
  thumbnailAnimationDuration: 1000,
};

const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBootingUp, setIsBootingUp] = useState(true);

  const onLoadingFinished = () => {
    Logger.log('[AppProvider]: App loaded');

    AnalyticsService.track(MixEvents.AppOpen);

    setIsBootingUp(false);
  };

  return (
    <GestureHandlerRootView style={styles.gestureHandlerView}>
      <SystemBootUpProvider onLoadingFinished={onLoadingFinished}>
        <AnalyticsProvider>
          <ReactQueryProvider>
            <ReduxProvider>
              <StorageMigrationProvider>
                <LocalizationProvider>
                  <TamaguiProvider>
                    <NavigationProvider>
                      <PortalProvider>
                        <SafeAreaProvider>
                          <ToastProvider_NewImplementation>
                            <ToastProvider>
                              <SplashProvider isLoading={isBootingUp}>
                                {children}
                              </SplashProvider>
                            </ToastProvider>
                          </ToastProvider_NewImplementation>
                        </SafeAreaProvider>
                      </PortalProvider>
                    </NavigationProvider>
                  </TamaguiProvider>
                </LocalizationProvider>
              </StorageMigrationProvider>
            </ReduxProvider>
          </ReactQueryProvider>
        </AnalyticsProvider>
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
