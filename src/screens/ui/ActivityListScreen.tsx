import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/core';

import { UploadRetryBanner } from '@app/entities/activity';
import {
  AnalyticsService,
  MixEvents,
  MixProperties,
  useOnFocus,
} from '@app/shared/lib';
import { ActivityGroups } from '@app/widgets/activity-group';
import { StreamingStatusBar } from '@features/streaming';
import { AppletDetailsParamList } from '@screens/config';
import { Box, HorizontalCalendar } from '@shared/ui';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'ActivityList'>;

const ActivityListScreen: FC<Props> = props => {
  const appletId = props.route.params.appletId;

  const isFocused = useIsFocused();

  useOnFocus(() => {
    AnalyticsService.track(MixEvents.AppletView, {
      [MixProperties.AppletId]: appletId,
    });
  });

  return (
    <Box flex={1}>
      <UploadRetryBanner accessibilityLabel="upload-banner" />
      <HorizontalCalendar mt={8} />
      <StreamingStatusBar appletId={props.route.params.appletId} mb={20} />
      {isFocused && <ActivityGroups flex={1} px={14} appletId={appletId} />}
    </Box>
  );
};

export default ActivityListScreen;
