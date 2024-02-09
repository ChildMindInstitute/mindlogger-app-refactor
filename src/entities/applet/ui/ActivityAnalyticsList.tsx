import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { Box, ScrollView } from '@app/shared/ui';

import ActivityDataCard from './ActivityAnalyticsCard';
import { AppletAnalytics } from '../lib';

type Props = {
  analytics: AppletAnalytics | null;
};

const ActivityAnalyticsList: FC<Props> = ({ analytics }) => {
  return (
    <Box flex={1}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {analytics?.activitiesResponses?.map((response) => (
          <ActivityDataCard
            accessibilityLabel={`activity-data-card-${response.id}`}
            key={response.id}
            responseData={response}
          />
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
