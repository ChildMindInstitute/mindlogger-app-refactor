import { FC } from 'react';

import { Box, YStack } from '@app/shared/ui/base';

import { ActivityCard } from './ActivityCard';
import { ActivityListItem } from '../lib/types/activityListItem';

type Props = {
  activities: ActivityListItem[];
  onCardPress?: (activity: ActivityListItem) => void;
};

export const ActivityList: FC<Props> = ({ activities, onCardPress }) => {
  return (
    <YStack accessibilityLabel="activity-list-container" space={10}>
      {activities.map(x => (
        <Box key={x.eventId}>
          <ActivityCard
            activity={x}
            disabled={false}
            onPress={() => onCardPress?.(x)}
          />
        </Box>
      ))}
    </YStack>
  );
};
