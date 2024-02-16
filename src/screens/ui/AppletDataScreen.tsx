import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { UploadRetryBanner } from '@app/entities/activity';
import { ActivityAnalyticsList } from '@app/entities/applet';
import { useAppletAnalytics } from '@app/entities/applet/lib/hooks';
import {
  AnalyticsService,
  MixEvents,
  MixProperties,
  useOnFocus,
} from '@app/shared/lib';
import { ActivityIndicator, Box, HorizontalCalendar } from '@app/shared/ui';
import { AppletDetailsParamList } from '@screens/config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'Data'>;

const AppletDataScreen: FC<Props> = ({ route }) => {
  const {
    params: { appletId },
  } = route;

  const { analytics, isLoading } = useAppletAnalytics(appletId);

  useOnFocus(() => {
    AnalyticsService.track(MixEvents.DataView, {
      [MixProperties.AppletId]: appletId,
    });
  });

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  return (
    <Box flexGrow={1}>
      <UploadRetryBanner />
      <HorizontalCalendar mt={8} />
      <ActivityAnalyticsList analytics={analytics} />
    </Box>
  );
};

export default AppletDataScreen;
