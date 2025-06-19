import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { IS_ANDROID } from '@app/shared/lib/constants';
import { palette } from '@app/shared/lib/constants/palette';
import { AnimatedTouchable } from '@app/shared/ui/AnimatedTouchable';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { CardThumbnail } from '@app/shared/ui/CardThumbnail';
import { Chip } from '@app/shared/ui/Chip';
import { ChevronRightIcon } from '@app/shared/ui/icons';
import { ExclamationIcon } from '@app/shared/ui/icons/ExclamationIcon';
import { Text } from '@app/shared/ui/Text';

import { ActivityAssignmentBadge } from './ActivityAssignmentBadge';
import { ActivityFlowStep } from './ActivityFlowStep';
import { TimeStatusRecord } from './TimeStatusRecord';
import { useActivityAssignment } from '../lib/hooks/useActivityAssignment';
import {
  ActivityListItem,
  ActivityStatus,
  ActivityType,
} from '../lib/types/activityListItem';

type Props = {
  activity: ActivityListItem;
  disabled: boolean;
  onPress?: (...args: unknown[]) => void;
  isWebOnly?: boolean;
};

export const ActivityCard: FC<Props> = ({
  activity,
  disabled,
  isWebOnly = false,
  onPress,
}) => {
  const { t } = useTranslation();
  const { assignment } = useActivityAssignment({
    appletId: activity.appletId,
    activityId: activity.activityId,
    activityFlowId: activity.flowId,
    targetSubjectId: activity.targetSubjectId,
  });

  const isDisabled = disabled || activity.status === ActivityStatus.Scheduled;
  const hasDescription = `${activity.description || ''}`.trim().length > 0;

  const accessibilityLabel = activity.isInActivityFlow
    ? `activity-flow-${activity.activityFlowDetails?.activityFlowName || ''}`
    : `activity-${activity.name}`;

  return (
    <AnimatedTouchable
      aria-label={accessibilityLabel}
      onPress={onPress}
      disabled={isDisabled}
      style={{ borderRadius: 16 }}
    >
      <XStack p={16} gap={8} ai="center">
        <YStack gap={8} flex={1}>
          <YStack gap={8} flex={1} opacity={isDisabled ? 0.5 : 1}>
            {activity.isInActivityFlow &&
              activity.activityFlowDetails?.showActivityFlowBadge && (
                <ActivityFlowStep {...activity.activityFlowDetails} />
              )}

            {!!activity.image && (
              <CardThumbnail
                imageUri={activity.image}
                aria-label="activity_card-image"
                mb={8}
              />
            )}

            <Text
              fontSize={22}
              lineHeight={28}
              fontWeight="700"
              aria-label="activity_card_name-text"
            >
              {activity.name}
            </Text>

            {assignment &&
              assignment.respondent.id !== assignment.target.id && (
                <XStack>
                  <ActivityAssignmentBadge
                    assignment={assignment}
                    aria-label="activity_card_assignment-text"
                  />
                </XStack>
              )}

            {hasDescription && (
              <Text
                fontSize={16}
                lineHeight={24}
                aria-label="activity_card_desc-text"
              >
                {activity.description}
              </Text>
            )}

            {isWebOnly && (
              <XStack>
                <Chip icon={ExclamationIcon} variant="error">
                  {t('activity:completeOnWeb')}
                </Chip>
              </XStack>
            )}
          </YStack>

          <TimeStatusRecord activity={activity} />

          {IS_ANDROID && activity.type === ActivityType.Flanker && (
            <Text mt={12} color={palette.alert}>
              {t('activity:flanker_accuracy_warn')}
            </Text>
          )}
        </YStack>

        <Box p={2}>
          <ChevronRightIcon color={palette.on_surface} size={18} />
        </Box>
      </XStack>
    </AnimatedTouchable>
  );
};
