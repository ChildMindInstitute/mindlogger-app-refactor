import { FC, PropsWithChildren, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CacheManager } from '@georstat/react-native-image-cache';
import { PortalProvider } from '@tamagui/portal';
import { Dirs } from 'react-native-file-access';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { LocalizationProvider } from '@app/entities/localization/ui/LocalizationProvider';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import { MixEvents } from '@app/shared/lib/analytics/IAnalyticsService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { AnalyticsProvider } from './AnalyticsProvider';
import { FeatureFlagsProvider } from './FeatureFlagsProvider';
import { FontLanguageProvider } from './FontLanguageProvider';
import { NavigationProvider } from './NavigationProvider';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { SplashProvider } from './SplashProvider';
import { StorageMigrationProvider } from './StorageMigrationProvider';
import { SystemBootUpProvider } from './SystemBootUpProvider';
import { TamaguiProvider } from './TamaguiProvider';
import { ToastConfig } from './ToastConfig';

CacheManager.config = {
  baseDir: `${Dirs.CacheDir}/images_cache/`,
  blurRadius: 15,
  cacheLimit: 0,
  sourceAnimationDuration: 1000,
  thumbnailAnimationDuration: 1000,
};

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isBootingUp, setIsBootingUp] = useState(true);

  const onLoadingFinished = () => {
    getDefaultLogger().log('[AppProvider]: App loaded');

    getDefaultAnalyticsService().track(MixEvents.AppOpen);

    setIsBootingUp(false);
  };

  return (
    <GestureHandlerRootView style={styles.gestureHandlerView}>
      <SystemBootUpProvider onLoadingFinished={onLoadingFinished}>
        <FeatureFlagsProvider>
          <AnalyticsProvider>
            <ReactQueryProvider>
              <ReduxProvider>
                <StorageMigrationProvider>
                  <LocalizationProvider>
                    <TamaguiProvider>
                      <FontLanguageProvider>
                        <NavigationProvider>
                          <PortalProvider>
                            <SafeAreaProvider>
                              <SplashProvider isLoading={isBootingUp}>
                                {children}
                              </SplashProvider>

                              <Toast config={ToastConfig} topOffset={0} />
                            </SafeAreaProvider>
                          </PortalProvider>
                        </NavigationProvider>
                      </FontLanguageProvider>
                    </TamaguiProvider>
                  </LocalizationProvider>
                </StorageMigrationProvider>
              </ReduxProvider>
            </ReactQueryProvider>
          </AnalyticsProvider>
        </FeatureFlagsProvider>
      </SystemBootUpProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandlerView: {
    flex: 1,
  },
});
