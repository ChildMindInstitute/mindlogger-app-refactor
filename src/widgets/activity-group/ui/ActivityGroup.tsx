import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { clearStorageRecords } from '@app/features/pass-survey';
import { ActivityList, ActivityListItem } from '@entities/activity';
import { AppletModel } from '@entities/applet';
import { Box, BoxProps, Text } from '@shared/ui';

import { ActivityListGroup } from '../lib';

type Props = BoxProps & {
  appletId: string;
  group: ActivityListGroup;
};

const ActivityGroup: FC<Props> = ({ appletId, group, ...styledProps }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const { startFlow, startActivity } =
    AppletModel.useInProgressEntities(appletId);

  function navigateSurvey(
    activityId: string,
    eventId: string,
    flowId?: string,
  ) {
    navigate('InProgressActivity', {
      appletId,
      activityId,
      eventId,
      flowId,
    });
  }

  const startActivityOrFlow = ({
    activityId,
    eventId,
    flowId,
  }: ActivityListItem) => {
    if (flowId) {
      startFlow(flowId, activityId, eventId).then(startedFromScratch => {
        if (startedFromScratch) {
          clearStorageRecords.byEventId(eventId);
        }

        navigateSurvey(activityId, eventId, flowId);
      });
    } else {
      startActivity(activityId, eventId).then(startedFromScratch => {
        if (startedFromScratch) {
          clearStorageRecords.byEventId(eventId);
        }

        navigateSurvey(activityId, eventId);
      });
    }
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
        onCardPress={startActivityOrFlow}
      />
    </Box>
  );
};

export default ActivityGroup;
