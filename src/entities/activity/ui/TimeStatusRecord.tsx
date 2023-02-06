import { FC } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { Box, BoxProps, Text } from '@app/shared/ui';

import { ActivityListItem, ActivityStatus } from '../lib';

type Props = BoxProps & {
  activity: ActivityListItem;
};

const StatusLine = styled(Text, {
  marginTop: 6,
  color: '$grey',
  fontSize: 12,
  fontWeight: '400',
});

const TimeStatusRecord: FC<Props> = ({ activity }, ...props) => {
  const { t } = useTranslation();

  const isStatusScheduled = activity.status === ActivityStatus.Scheduled;

  const isStatusPastDue = activity.status === ActivityStatus.PastDue;

  const isStatusInProgress = activity.status === ActivityStatus.InProgress;

  const hasSceduledAt =
    isStatusScheduled && activity.hasEventContext && !activity.isTimeoutAllow;

  const hasAvailableFromTo =
    isStatusScheduled && activity.hasEventContext && activity.isTimeoutAllow;

  const hasAvailableToOnly = isStatusPastDue;

  const hasTimeToComplete =
    (isStatusScheduled || isStatusPastDue || isStatusInProgress) &&
    activity.isTimedActivityAllow &&
    !!activity.timeToComplete;

  return (
    <Box {...props}>
      {hasSceduledAt && (
        <StatusLine>{`${t('activity_due_date:scheduled_at')} ${
          activity.scheduledAt
        }`}</StatusLine>
      )}

      {hasAvailableFromTo && (
        <StatusLine>
          {`${t('activity_due_date:available')} ${activity.availableFrom} ${t(
            'activity_due_date:to',
          )} ${activity.availableTo}`}
        </StatusLine>
      )}

      {hasAvailableToOnly && (
        <StatusLine>{`${t('activity_due_date:to')} ${
          activity.availableTo
        }`}</StatusLine>
      )}

      {hasTimeToComplete && (
        <StatusLine>
          {`${t(
            'timed_activity:time_to_complete_hm',
            activity.timeToComplete!,
          )}`}
        </StatusLine>
      )}
    </Box>
  );
};

export default TimeStatusRecord;
