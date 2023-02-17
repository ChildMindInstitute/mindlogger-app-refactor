import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { ActivityList } from '@app/entities/activity';
import { Box, BoxProps, Text } from '@app/shared/ui';

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

      <ActivityList activities={group.activities} />
    </Box>
  );
};

export default ActivityGroup;
