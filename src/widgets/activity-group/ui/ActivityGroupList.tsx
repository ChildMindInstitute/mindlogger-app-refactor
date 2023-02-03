import { FC } from 'react';

import { Box, BoxProps, YStack } from '@app/shared/ui';

import ActivityGroup from './ActivityGroup';
import { useActivityGroups } from '../model';

type Props = BoxProps;

const ActivityGroupList: FC<Props> = props => {
  const activityGroups = useActivityGroups();

  return (
    <Box {...props}>
      <YStack space={12}>
        {activityGroups.map(g => (
          <ActivityGroup group={g} key={g.name} />
        ))}
      </YStack>
    </Box>
  );
};

export default ActivityGroupList;
