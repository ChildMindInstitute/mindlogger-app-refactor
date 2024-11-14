import { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';

import { IS_ANDROID, IS_IOS } from '@app/shared/lib/constants';
import { colors } from '@app/shared/lib/constants/colors';
import { Box, XStack, YStack } from '@app/shared/ui/base';
import { Chip } from '@app/shared/ui/Chip';
import { ChevronRightIcon } from '@app/shared/ui/icons';
import { ExclamationIcon } from '@app/shared/ui/icons/ExclamationIcon';
import { RoundLogo } from '@app/shared/ui/RoundLogo';
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
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={isDisabled}
    >
      <XStack
        backgroundColor={colors.white}
        borderColor={colors.lighterGrey}
        borderRadius={9}
        borderWidth={3}
        gap={14}
        mx={3}
        opacity={disabled ? 0.5 : 1}
        p={14}
      >
        {!!activity.image && (
          <Box alignSelf="center" accessibilityLabel="activity_card-image">
            <RoundLogo imageUri={activity.image} />
          </Box>
        )}

        <YStack flexGrow={1} flexShrink={1} gap={8}>
          {activity.isInActivityFlow &&
            activity.activityFlowDetails?.showActivityFlowBadge && (
              <ActivityFlowStep hasOpacity={isDisabled} activity={activity} />
            )}

          <Text
            fontWeight={IS_IOS ? '600' : '700'}
            fontSize={16}
            accessibilityLabel="activity_card_name-text"
            lineHeight={20}
            opacity={isDisabled ? 0.5 : 1}
          >
            {activity.name}
          </Text>

          {assignment && assignment.respondent.id !== assignment.target.id && (
            <XStack>
              <ActivityAssignmentBadge
                assignment={assignment}
                accessibilityLabel="activity_card_assignment-text"
                isDisabled={isDisabled}
              />
              <Box flexGrow={1} flexShrink={1} />
            </XStack>
          )}

          {hasDescription && (
            <Text
              fontSize={14}
              fontWeight="300"
              lineHeight={20}
              opacity={isDisabled ? 0.5 : 1}
              accessibilityLabel="activity_card_desc-text"
            >
              {activity.description}
            </Text>
          )}

          {isWebOnly && (
            <Chip icon={ExclamationIcon} variant="warning">
              {t('activity:completeOnWeb')}
            </Chip>
          )}

          <TimeStatusRecord activity={activity} />

          {IS_ANDROID && activity.type === ActivityType.Flanker && (
            <Text mt={12} color={colors.alert}>
              {t('activity:flanker_accuracy_warn')}
            </Text>
          )}
        </YStack>

        <Box alignSelf="center">
          <ChevronRightIcon color={colors.grey2} size={16} />
        </Box>
      </XStack>
    </TouchableOpacity>
  );
};
