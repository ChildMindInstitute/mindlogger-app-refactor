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

  const isStatusAvailable = activity.status === ActivityStatus.Available;

  const isStatusInProgress = activity.status === ActivityStatus.InProgress;

  const hasScheduledAt = isStatusScheduled && !!activity.scheduledAt; // todo - clarify if we can see activities for future

  const hasAvailableFromTo = isStatusScheduled && activity.isTimeIntervalSet;

  const hasAvailableToOnly = isStatusAvailable;

  const hasTimeToComplete =
    isStatusInProgress && activity.isTimerSet && !!activity.timeLeftToComplete;

  return (
    <Box {...props}>
      {hasScheduledAt && (
        <StatusLine>{`${t('activity_due_date:scheduled_at')} ${t(
          activity.scheduledAt!,
        )}`}</StatusLine>
      )}

      {hasAvailableFromTo && (
        <StatusLine>
          {`${t('activity_due_date:available')} ${t(
            activity.availableFrom!,
          )} ${t('activity_due_date:to')} ${t(activity.availableTo!)}`}
        </StatusLine>
      )}

      {hasAvailableToOnly && (
        <StatusLine>{`${t('activity_due_date:to')} ${t(
          activity.availableTo!,
        )}`}</StatusLine>
      )}

      {hasTimeToComplete && (
        <StatusLine>
          {`${t(
            'timed_activity:time_to_complete_hm',
            activity.timeLeftToComplete!,
          )}`}
        </StatusLine>
      )}
    </Box>
  );
};

export default TimeStatusRecord;
