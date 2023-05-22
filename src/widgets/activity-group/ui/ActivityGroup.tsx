import { FC } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { EntityType } from '@app/abstract/lib';
import { MediaLookupService } from '@app/features/offline-checks';
import { ActivityList, ActivityListItem } from '@entities/activity';
import { AppletModel, clearStorageRecords } from '@entities/applet';
import { Box, BoxProps, Text } from '@shared/ui';

import { ActivityListGroup } from '../lib';

type Props = BoxProps & {
  appletId: string;
  group: ActivityListGroup;
};

const ActivityGroup: FC<Props> = ({ appletId, group, ...styledProps }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const { startFlow, startActivity } = AppletModel.useStartEntity({
    hasMediaReferences: MediaLookupService.lookup,
  });

  function navigateSurvey(
    entityId: string,
    entityType: EntityType,
    eventId: string,
  ) {
    navigate('InProgressActivity', {
      appletId,
      entityId,
      entityType,
      eventId,
    });
  }

  const startActivityOrFlow = ({
    activityId,
    eventId,
    flowId,
    isTimerElapsed,
  }: ActivityListItem) => {
    if (flowId) {
      startFlow(appletId, flowId, eventId, isTimerElapsed).then(result => {
        if (result.cannotBeStartedDueToMediaFound) {
          return;
        }

        if (result.startedFromScratch) {
          clearStorageRecords.byEventId(eventId);
        }

        navigateSurvey(flowId, 'flow', eventId);
      });
    } else {
      startActivity(appletId, activityId, eventId, isTimerElapsed).then(
        result => {
          if (result.cannotBeStartedDueToMediaFound) {
            return;
          }

          if (result.startedFromScratch) {
            clearStorageRecords.byEventId(eventId);
          }

          navigateSurvey(activityId, 'regular', eventId);
        },
      );
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
