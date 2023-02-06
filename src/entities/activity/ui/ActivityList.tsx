import { FC } from 'react';

import { Box, YStack } from '@app/shared/ui';

import ActivityCard from './ActivityCard';
import { ActivityListItem } from '../lib';

type Props = {
  activities: ActivityListItem[];
};

const ActivityList: FC<Props> = ({ activities }) => {
  return (
    <YStack space={10}>
      {activities.map(x => (
        <Box key={x.id}>
          <ActivityCard activity={x} disabled={false} />
        </Box>
      ))}
    </YStack>
  );
};

export default ActivityList;
