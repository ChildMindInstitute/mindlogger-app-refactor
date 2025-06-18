import { FC, useCallback, useLayoutEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
import { Text } from '@app/shared/ui/Text';
import { TouchableOpacity } from '@app/shared/ui/TouchableOpacity';
import { UploadRetryBanner } from '@app/widgets/survey/ui/UploadRetryBanner';

type SelectedApplet = Pick<Applet, 'id' | 'displayName'>;

export const AppletsScreen: FC = () => {
  const { t } = useTranslation();
  const { navigate, setOptions } = useNavigation();
  const dispatch = useAppDispatch();

  const userFirstName = useAppSelector(selectFirstName);

  useLayoutEffect(() => {
    if (userFirstName) {
      setOptions({ title: `${t('additional:hi')} ${userFirstName}!` });
    }
  }, [t, userFirstName, setOptions]);

  useOnFocus(() => {
    getDefaultAnalyticsService().track(MixEvents.HomeView);

    // Color must match the AppletsScreen's headerStyle.backgroundColor in RootNavigator
    dispatch(bannerActions.setBannersBg(palette.surface1));
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

  useAutomaticRefreshOnMount(async () => {
    await getDefaultNotificationRefreshService().refresh(
      queryClient,
      progressions,
      responseTimes,
      LogTrigger.FirstAppRun,
    );
    getDefaultLogger()
      .send()
      .catch(err => getDefaultLogger().error(err as never));
  });

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
    </Box>
  );
};

const AboutAppLink = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <XStack jc="center">
      <TouchableOpacity
        accessibilityLabel="about-link"
        onPress={() => navigate('AboutApp')}
      >
        {/*@todo revert after testing*/}
        <Text color="$primary" fontSize={16} fontWeight="700">
          {t('applet_list_component:about_title')}
        </Text>
        {/*@todo revert after testing*/}
      </TouchableOpacity>
    </XStack>
  );
};
