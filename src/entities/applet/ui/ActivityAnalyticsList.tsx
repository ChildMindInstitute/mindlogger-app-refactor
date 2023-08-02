import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { Box, ScrollView } from '@app/shared/ui';

import ActivityDataCard from './ActivityAnalyticsCard';
import { ActivityResponses } from '../lib';

type Props = {
  activitiesResponses: Array<ActivityResponses>;
};

const ActivityAnalyticsList: FC<Props> = ({ activitiesResponses }) => {
  return (
    <Box flex={1}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {activitiesResponses.map(response => (
          <ActivityDataCard key={response.id} responseData={response} />
        ))}
      </ScrollView>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ActivityAnalyticsList;
