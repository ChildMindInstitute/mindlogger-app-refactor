import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { UploadRetryBanner } from '@app/entities/activity';
import { ActivityAnalyticsList } from '@app/entities/applet';
import { useAppletAnalytics } from '@app/entities/applet/lib/hooks';
import { Box, HorizontalCalendar } from '@app/shared/ui';
import { AppletDetailsParamList } from '@screens/config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'Data'>;

const AppletDataScreen: FC<Props> = ({ route }) => {
  const {
    params: { appletId },
  } = route;

  const { analytics } = useAppletAnalytics(appletId);

  return (
    <Box flexGrow={1}>
      <UploadRetryBanner />
      <HorizontalCalendar mt={8} />
      <ActivityAnalyticsList analytics={analytics} />
    </Box>
  );
};

export default AppletDataScreen;
