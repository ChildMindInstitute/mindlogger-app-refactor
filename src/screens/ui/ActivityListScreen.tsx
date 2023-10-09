import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { UploadRetryBanner } from '@app/entities/activity';
import { ActivityGroupList } from '@app/widgets/activity-group';
import { StreamingStatusBar } from '@features/streaming';
import { AppletDetailsParamList } from '@screens/config';
import { Box, HorizontalCalendar, ScrollView } from '@shared/ui';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'ActivityList'>;

const ActivityListScreen: FC<Props> = props => {
  return (
    <Box flex={1}>
      <UploadRetryBanner data-test="upload-banner" />
      <HorizontalCalendar mt={8} />
      <StreamingStatusBar appletId={props.route.params.appletId} />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ActivityGroupList
          flex={1}
          px={14}
          pt={20}
          pb={42}
          appletId={props.route.params.appletId}
        />
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ActivityListScreen;
