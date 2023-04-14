import { FC } from 'react';

import { styled } from '@tamagui/core';
import { useTranslation } from 'react-i18next';

import { convertToTimeOnNoun } from '@app/shared/lib';
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

  const hasScheduledAt = isStatusScheduled && !!activity.scheduledAt;

  const hasAvailableFromTo = isStatusScheduled;

  const hasAvailableToOnly = isStatusAvailable;

  const hasTimeToComplete =
    isStatusInProgress && activity.isTimerSet && !!activity.timeLeftToComplete;

  const hasTimerElapsed =
    isStatusInProgress &&
    activity.isTimerSet &&
    !activity.timeLeftToComplete &&
    activity.isTimerElapsed;

  const convert = (date: Date): string => {
    const convertResult = convertToTimeOnNoun(date);
    if (convertResult.translationKey) {
      return t(convertResult.translationKey);
    } else {
      return convertResult.formattedDate!;
    }
  };

  return (
    <Box {...props}>
      {hasScheduledAt && (
        <StatusLine>{`${t('activity_due_date:scheduled_at')} ${convert(
          activity.scheduledAt!,
        )}`}</StatusLine>
      )}

      {hasAvailableFromTo && (
        <StatusLine>
          {`${t('activity_due_date:available')} ${convert(
            activity.availableFrom!,
          )} ${t('activity_due_date:to')} ${convert(activity.availableTo!)}`}
        </StatusLine>
      )}

      {hasAvailableToOnly && (
        <StatusLine>{`${t('activity_due_date:to')} ${convert(
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

      {hasTimerElapsed && (
        <StatusLine>{t('additional:time-end-tap')}</StatusLine>
      )}
    </Box>
  );
};

export default TimeStatusRecord;
