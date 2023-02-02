import { FC } from 'react';

import { ActivityGroup } from '@app/entities/activity';
import { Box, BoxProps, YStack } from '@app/shared/ui';

import { useActivityGroups } from '../model/hooks/useActivityGroups';

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
