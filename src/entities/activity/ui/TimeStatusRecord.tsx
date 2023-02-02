/* eslint-disable indent */
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

  return (
    <Box {...props}>
      {isStatusScheduled &&
        activity.hasEventContext &&
        !activity.isTimeoutAllow && (
          <StatusLine>{`${t('activity_due_date:scheduled_at')} ${
            activity.scheduledAt
          }`}</StatusLine>
        )}

      {isStatusScheduled &&
        activity.hasEventContext &&
        activity.isTimeoutAllow && (
          <StatusLine>
            {`${t('activity_due_date:available')} ${activity.availableFrom} ${t(
              'activity_due_date:to',
            )} ${activity.availableTo}`}
          </StatusLine>
        )}

      {isStatusPastDue && (
        <StatusLine>{`${t('activity_due_date:to')} ${
          activity.availableTo
        }`}</StatusLine>
      )}

      {(isStatusScheduled || isStatusPastDue || isStatusInProgress) &&
        activity.isTimedActivityAllow &&
        !!activity.timeToComplete && (
          <StatusLine>
            {`${t(
              'timed_activity:time_to_complete_hm',
              activity.timeToComplete,
            )}`}
          </StatusLine>
        )}
    </Box>
  );
};

export default TimeStatusRecord;
