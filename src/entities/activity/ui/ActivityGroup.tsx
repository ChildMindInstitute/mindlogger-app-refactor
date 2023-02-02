import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { Box, BoxProps, Text, YStack } from '@app/shared/ui';

import ActivityCard from './ActivityCard';
import { ActivityListGroup } from '../lib';

type Props = BoxProps & {
  group: ActivityListGroup;
};

const ActivityGroup: FC<Props> = props => {
  const { t } = useTranslation();

  const group: ActivityListGroup = props.group;

  return (
    <Box {...props}>
      <Box mb={10}>
        <Text mb={4} fontSize={14} fontWeight="600" color="$darkGrey2">
          {t(group.name)}
        </Text>

        <Box width="100%" height={1} bc="$darkGrey2" />
      </Box>

      <YStack space={10}>
        {group.activities.map(x => (
          <Box key={x.id}>
            <ActivityCard activity={x} disabled={false} />
          </Box>
        ))}
      </YStack>
    </Box>
  );
};

export default ActivityGroup;
