import { FC, useCallback, useLayoutEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Applet } from '@app/entities/applet/lib/types';
import {
  selectAppletsEntityProgressions,
  selectEntityResponseTimes,
} from '@app/entities/applet/model/selectors';
import { AppletList } from '@app/entities/applet/ui/AppletList';
import { bannerActions } from '@app/entities/banner/model/slice';
import { selectFirstName } from '@app/entities/identity/model/selectors';
import { getDefaultNotificationRefreshService } from '@app/entities/notification/model/notificationRefreshServiceInstance';
import { useAutomaticRefreshOnMount } from '@app/features/applets-refresh/model/hooks/useAutomaticRefreshOnMount';
import { AppletsRefresh } from '@app/features/applets-refresh/ui/AppletsRefresh';
import { LogTrigger } from '@app/shared/api/services/INotificationService';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { palette } from '@app/shared/lib/constants/palette';
import { useAppSelector } from '@app/shared/lib/hooks/redux';
import { useAppDispatch } from '@app/shared/lib/hooks/redux';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { Box, XStack } from '@app/shared/ui/base';
import { Spinner } from '@app/shared/ui/Spinner';
import { Text } from '@app/shared/ui/Text';
import { TouchableOpacity } from '@app/shared/ui/TouchableOpacity';
import { UploadRetryBanner } from '@app/widgets/survey/ui/UploadRetryBanner';

type SelectedApplet = Pick<Applet, 'id' | 'displayName'>;

export const AppletsScreen: FC = () => {
  const { t } = useTranslation();
  const { navigate, setOptions } = useNavigation();
  const dispatch = useAppDispatch();
  const { bottom } = useSafeAreaInsets();

  const userFirstName = useAppSelector(selectFirstName);

  useLayoutEffect(() => {
    if (userFirstName) {
      setOptions({ title: `${t('additional:hi')} ${userFirstName}!` });
    }
  }, [t, userFirstName, setOptions]);

  const [, setForceUpdate] = useState({});
  useOnFocus(() => {
    getDefaultAnalyticsService().track(MixEvents.HomeView);

    // Color must match the AppletsScreen's headerStyle.backgroundColor in RootNavigator
    dispatch(bannerActions.setBannersBg(palette.surface1));

    // This forces a re-render to the screen to ensure the FlatList (inside AppletList)
    // does an initial render upon navigation from the login screen on iOS only.
    // Without this, the FlatList looks empty, even if there's data.
    setTimeout(() => setForceUpdate({}));
  });

  const queryClient = useQueryClient();

  const progressions = useAppSelector(selectAppletsEntityProgressions);

  const responseTimes = useAppSelector(selectEntityResponseTimes);

  const navigateAppletDetails: (applet: SelectedApplet) => void = useCallback(
    ({ id, displayName }) => {
      navigate('AppletDetails', { appletId: id, title: displayName });

      getDefaultAnalyticsService().track(MixEvents.AppletSelected, {
        [MixProperties.AppletId]: id,
      });
    },
    [navigate],
  );

  const { isRefreshing: isHydratingCache } = useAutomaticRefreshOnMount(
    async () => {
      await getDefaultNotificationRefreshService().refresh(
        queryClient,
        progressions,
        responseTimes,
        LogTrigger.FirstAppRun,
      );
      getDefaultLogger()
        .send()
        .catch(err => getDefaultLogger().error(err as never));
    },
  );

  return (
    <Box flex={1} bg="$surface1">
      <UploadRetryBanner />

      <Box flex={1}>
        <AppletList
          flex={1}
          refreshControl={<AppletsRefresh />}
          ListFooterComponent={<AboutAppLink />}
          onAppletPress={navigateAppletDetails}
        />
      </Box>

      <Spinner withOverlay isVisible={isHydratingCache} />
    </Box>
  );
};

const AboutAppLink = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <XStack jc="center" mb={16}>
      <TouchableOpacity
        aria-label="about-link"
        onPress={() => navigate('AboutApp')}
      >
        <Text color="$primary" fontSize={16} fontWeight="700">
          {t('applet_list_component:about_title')}
        </Text>
      </TouchableOpacity>
    </XStack>
  );
};
