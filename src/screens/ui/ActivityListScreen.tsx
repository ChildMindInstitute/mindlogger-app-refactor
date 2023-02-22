import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { ActivityGroupList } from '@app/widgets/activity-group';
import { AppletDetailsParamList } from '@screens/config';
import {
  Box,
  HorizontalCalendar,
  ImageBackground,
  ScrollView,
} from '@shared/ui';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'ActivityList'>;

const ActivityListScreen: FC<Props> = props => {
  return (
    <Box bg="$secondary" flex={1}>
      <ImageBackground>
        <HorizontalCalendar mt={8} />

        <ScrollView contentContainerStyle={styles.scrollView}>
          <ActivityGroupList
            flex={1}
            px={14}
            pt={20}
            pb={42}
            appletId={props.route.params.appletId}
          />
        </ScrollView>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ActivityListScreen;
