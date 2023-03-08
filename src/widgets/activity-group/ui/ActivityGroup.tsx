import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ActivityList, ActivityListItem } from '@entities/activity';
import { Box, BoxProps, Text } from '@shared/ui';

import { ActivityListGroup } from '../lib';

type Props = BoxProps & {
  appletId: string;
  group: ActivityListGroup;
};

const ActivityGroup: FC<Props> = ({ appletId, group, ...styledProps }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const navigateActivity = (activity: ActivityListItem) => {
    navigate('InProgressActivity', {
      appletId,
      activityId: activity.activityId,
      eventId: activity.eventId,
    });
  };

  return (
    <Box {...styledProps}>
      <Box mb={10}>
        <Text mb={4} fontSize={14} fontWeight="600" color="$darkGrey2">
          {t(group.name)}
        </Text>

        <Box width="100%" height={1} bc="$darkGrey2" />
      </Box>

      <ActivityList
        activities={group.activities}
        onCardPress={navigateActivity}
      />
    </Box>
  );
};

export default ActivityGroup;
