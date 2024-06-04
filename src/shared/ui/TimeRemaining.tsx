import React, { FC, useEffect, useState } from 'react';
import { ViewProps } from 'react-native';

import { XStack } from '@tamagui/stacks';

import { BoxProps, ClockIcon, Text } from '@app/shared/ui';

import {
  HourMinute,
  getMsFromHours,
  getMsFromMinutes,
  colors,
  ONE_SECOND,
  getClockTime,
} from '../lib';

type Props = {
  timerSettings: HourMinute;
  entityStartedAt: number;
  clockIconShown: boolean;
} & BoxProps &
  ViewProps;

const TEN_SECONDS = ONE_SECOND * 10;

const TimeRemaining: FC<Props> = (props: Props) => {
  const { timerSettings, entityStartedAt, clockIconShown } = props;

  const [timeLeft, setTimLeft] = useState<number>(0);

  const duration =
    getMsFromHours(timerSettings.hours) +
    getMsFromMinutes(timerSettings.minutes);

  const formattedTimeLeft = getClockTime(timeLeft);

  const textColor =
    timeLeft > TEN_SECONDS ? colors.onSurface : colors.alertDark;
  const iconColor = timeLeft > TEN_SECONDS ? colors.grey4 : colors.alertDark;

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - entityStartedAt;

      if (elapsed > duration) {
        clearInterval(id);
        setTimLeft(0);
      } else {
        setTimLeft(duration - elapsed);
      }
    }, ONE_SECOND);

    return () => clearInterval(id);
  }, [duration, entityStartedAt]);

  if (!formattedTimeLeft) {
    return null;
  }

  return (
    <XStack alignItems="center" backgroundColor="$white" {...props}>
      {clockIconShown && <ClockIcon size={20} color={iconColor} />}
      <Text
        ml={5}
        fontSize={15}
        fontWeight="400"
        color={textColor}
        fontFamily="Atkinson Hyperlegible Regular"
      >
        {formattedTimeLeft}
      </Text>
    </XStack>
  );
};

export default TimeRemaining;
