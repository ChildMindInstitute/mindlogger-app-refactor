import { FC } from 'react';

import { styled } from '@tamagui/core';
import { addDays, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { convertToTimeOnNoun } from '@app/shared/lib/utils/dateTime';
import { Box, BoxProps } from '@app/shared/ui/base';
import { Text } from '@app/shared/ui/Text';

import {
  ActivityListItem,
  ActivityStatus,
} from '../lib/types/activityListItem';

type Props = BoxProps & {
  activity: ActivityListItem;
};

const StatusLine = styled(Text, {
  mt: 4,
  p: 4,
  color: '$outline',
  fontSize: 14,
  lineHeight: 20,
  textAlign: 'center',
});

export const TimeStatusRecord: FC<Props> = ({ activity, ...props }) => {
  const { t } = useTranslation();

  const isStatusScheduled = activity.status === ActivityStatus.Scheduled;

  const isStatusAvailable = activity.status === ActivityStatus.Available;

  const isStatusInProgress = activity.status === ActivityStatus.InProgress;

  const hasAvailableFromTo = isStatusScheduled;

  const hasAvailableToOnly =
    isStatusAvailable || (isStatusInProgress && !!activity.availableTo);

  const hasTimeToComplete =
    activity.isTimerSet && !!activity.timeLeftToComplete;

  const tomorrow = addDays(startOfDay(new Date()), 1);

  const isSpreadToNextDay =
    !!activity.availableTo && activity.availableTo > tomorrow;

  const convert = (date: Date): string => {
    const convertResult = convertToTimeOnNoun(date);
    if (convertResult.translationKey) {
      return t(convertResult.translationKey);
    } else {
      return convertResult.formattedDate!;
    }
  };

  if (
    !hasAvailableFromTo &&
    !hasAvailableToOnly &&
    !hasTimeToComplete &&
    !activity.isExpired
  ) {
    return null;
  }

  return (
    <Box {...props}>
      {hasAvailableFromTo && (
        <StatusLine>
          {`${t('activity_due_date:available')} ${convert(
            activity.availableFrom!,
          )} ${t('activity_due_date:to')} ${convert(activity.availableTo!)} ${
            isSpreadToNextDay ? t('activity_due_date:the_following_day') : ''
          }`}
        </StatusLine>
      )}

      {hasAvailableToOnly && (
        <StatusLine>{`${t('activity_due_date:to')} ${convert(
          activity.availableTo!,
        )} ${
          isSpreadToNextDay ? t('activity_due_date:the_following_day') : ''
        }`}</StatusLine>
      )}

      {hasTimeToComplete && (
        <StatusLine>
          {`${t(
            'timed_activity:time_to_complete_hm',
            activity.timeLeftToComplete!,
          )}`}
        </StatusLine>
      )}

      {activity.isExpired && (
        <StatusLine>{t('additional:time-end-tap')}</StatusLine>
      )}
    </Box>
  );
};
