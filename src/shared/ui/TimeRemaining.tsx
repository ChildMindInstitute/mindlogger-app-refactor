import React, { FC, useEffect, useState } from 'react';

import { XStack } from '@tamagui/stacks';
import { useTranslation } from 'react-i18next';

import { BoxProps, ClockIcon, Text } from '@app/shared/ui';

import {
  HourMinute,
  MINUTES_IN_HOUR,
  MS_IN_MINUTE,
  MS_IN_SECOND,
  getMsFromHours,
  getMsFromMinutes,
  getTwoDigits,
  colors,
} from '../lib';

type Props = {
  timerSettings: HourMinute;
  entityStartedAt: number;
} & BoxProps;

const TimeRemaining: FC<Props> = (props: Props) => {
  const { timerSettings, entityStartedAt } = props;

  const [left, setLeft] = useState<number | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const id = setInterval(() => {
      const duration = getEntityDuration();

      const elapsed = Date.now() - entityStartedAt;

      if (elapsed > duration) {
        clearInterval(id);
        setLeft(null);
      } else {
        setLeft(duration - elapsed);
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEntityDuration = (): number => {
    return (
      getMsFromHours(timerSettings.hours) +
      getMsFromMinutes(timerSettings.minutes)
    );
  };

  const getFormattedTimeLeft = (): string => {
    if (!left) {
      return '';
    }
    const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR);
    const minutes = Math.floor((left - getMsFromHours(hours)) / MS_IN_MINUTE);
    const seconds = Math.round(
      (left - getMsFromHours(hours) - getMsFromMinutes(minutes)) / MS_IN_SECOND,
    );

    return `${getTwoDigits(hours)}:${getTwoDigits(minutes)}:${getTwoDigits(
      seconds,
    )}`;
  };

  const text = getFormattedTimeLeft();

  if (!text) {
    return null;
  }

  const timeIsRunningOut = left! <= 10000;

  return (
    <XStack alignItems="center" backgroundColor="$white" {...props}>
      <ClockIcon
        size={20}
        color={timeIsRunningOut ? colors.alertDark : colors.mediumGrey}
      />
      <Text
        ml={5}
        fontSize={15}
        fontWeight="400"
        color={timeIsRunningOut ? '$alertDark' : '$grey4'}
        fontFamily="Atkinson Hyperlegible Regular"
      >
        {text}
      </Text>
    </XStack>
  );
};

export default TimeRemaining;
