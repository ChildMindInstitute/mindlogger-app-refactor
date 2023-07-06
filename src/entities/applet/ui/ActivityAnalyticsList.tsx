import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { Box, ScrollView } from '@app/shared/ui';
import { ActivityResponsesDto } from '@shared/api';

import ActivityDataCard from './ActivityAnalyticsCard';

type Props = {
  activitiesResponses: Array<ActivityResponsesDto>;
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
