import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { UploadRetryBanner } from '@app/entities/activity';
import {
  ActivityAnalyticsList,
  useAppletAnalyticsQuery,
} from '@app/entities/applet';
import { mapAppletAnalytics } from '@app/entities/applet/model';
import { Box, HorizontalCalendar } from '@app/shared/ui';
import { AppletDetailsParamList } from '@screens/config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'Data'>;

const AppletDataScreen: FC<Props> = ({ route }) => {
  const {
    params: { appletId },
  } = route;

  const { data: appletAnalytics } = useAppletAnalyticsQuery(appletId, {
    select: response => mapAppletAnalytics(response?.data.result),
  });

  return (
    <Box flexGrow={1}>
      <UploadRetryBanner />
      <HorizontalCalendar mt={8} />

      <ActivityAnalyticsList
        activitiesResponses={appletAnalytics?.activitiesResponses ?? []}
      />
    </Box>
  );
};

export default AppletDataScreen;
