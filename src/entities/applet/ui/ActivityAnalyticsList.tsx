import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { Box } from '@app/shared/ui/base';
import { GradientOverlay } from '@app/shared/ui/GradientOverlay';
import { ScrollView } from '@app/shared/ui/ScrollView';

import { ActivityAnalyticsCard } from './ActivityAnalyticsCard';
import { AppletAnalytics } from '../lib/types';

type Props = {
  analytics: AppletAnalytics | null;
};

export const ActivityAnalyticsList: FC<Props> = ({ analytics }) => {
  return (
    <Box flex={1}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {analytics?.activitiesResponses?.map(response => (
          <ActivityAnalyticsCard
            accessibilityLabel={`activity-data-card-${response.id}`}
            key={response.id}
            responseData={response}
          />
        ))}
      </ScrollView>
      <GradientOverlay position="top" />
      <GradientOverlay position="bottom" />
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
});
