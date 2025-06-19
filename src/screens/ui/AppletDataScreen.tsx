import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useAppletAnalytics } from '@app/entities/applet/lib/hooks/useAppletAnalytics';
import { ActivityAnalyticsList } from '@app/entities/applet/ui/ActivityAnalyticsList';
import { getDefaultAnalyticsService } from '@app/shared/lib/analytics/analyticsServiceInstance';
import {
  MixEvents,
  MixProperties,
} from '@app/shared/lib/analytics/IAnalyticsService';
import { useOnFocus } from '@app/shared/lib/hooks/useOnFocus';
import { ActivityIndicator } from '@app/shared/ui/ActivityIndicator';
import { Box } from '@app/shared/ui/base';
import { HorizontalCalendar } from '@app/shared/ui/HorizontalCalendar';
import { UploadRetryBanner } from '@app/widgets/survey/ui/UploadRetryBanner';

import { AppletDetailsParamList } from '../config/types';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'Data'>;

export const AppletDataScreen: FC<Props> = ({ route }) => {
  const {
    params: { appletId },
  } = route;

  const { analytics, isLoading } = useAppletAnalytics(appletId);

  useOnFocus(() => {
    getDefaultAnalyticsService().track(MixEvents.DataView, {
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
    <Box flex={1} bg="$surface1">
      <UploadRetryBanner />
      <HorizontalCalendar />
      <ActivityAnalyticsList analytics={analytics} />
    </Box>
  );
};
