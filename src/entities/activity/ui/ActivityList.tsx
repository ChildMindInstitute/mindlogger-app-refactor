import { FC } from 'react';

import { Box, YStack } from '@app/shared/ui';

import ActivityCard from './ActivityCard';
import { ActivityListItem } from '../lib';

type Props = {
  activities: ActivityListItem[];
  onCardPress?: (activity: ActivityListItem) => void;
};

const ActivityList: FC<Props> = ({ activities, onCardPress }) => {
  return (
    <YStack accessibilityLabel="activity-list-container" space={10}>
      {activities.map(x => (
        <Box key={x.eventId}>
          <ActivityCard
            accessibilityLabel={`activity-card-${x.activityId}`}
            activity={x}
            disabled={false}
            onPress={() => onCardPress?.(x)}
          />
        </Box>
      ))}
    </YStack>
  );
};

export default ActivityList;
