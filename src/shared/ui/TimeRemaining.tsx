import React, { FC, useEffect, useState } from 'react';
import { ViewProps } from 'react-native';

import { XStack, XStackProps } from '@tamagui/stacks';

import { ClockIcon } from './icons';
import { Text } from './Text';
import { ONE_SECOND } from '../lib/constants';
import { colors } from '../lib/constants/colors';
import { HourMinute } from '../lib/types/dateTime';
import {
  getClockTime,
  getMsFromHours,
  getMsFromMinutes,
} from '../lib/utils/dateTime';

type Props = {
  timerSettings: HourMinute;
  entityStartedAt: number;
  clockIconShown: boolean;
  onTimeElapsed: () => void;
} & XStackProps &
  ViewProps;

const TEN_SECONDS = ONE_SECOND * 10;

export const TimeRemaining: FC<Props> = (props: Props) => {
  const { timerSettings, entityStartedAt, clockIconShown, onTimeElapsed } =
    props;

  const initialTimeElapsed = Date.now() - entityStartedAt;

  const duration =
    getMsFromHours(timerSettings.hours) +
    getMsFromMinutes(timerSettings.minutes);

  const [timeLeft, setTimeLeft] = useState<number>(
    duration - initialTimeElapsed,
  );

  const formattedTimeLeft = getClockTime(timeLeft);

  const textColor =
    timeLeft > TEN_SECONDS ? colors.onSurface : colors.alertDark;
  const iconColor = timeLeft > TEN_SECONDS ? colors.grey4 : colors.alertDark;

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - entityStartedAt;

      if (elapsed > duration) {
        clearInterval(id);
        setTimeLeft(0);
        onTimeElapsed();
      } else {
        setTimeLeft(duration - elapsed);
      }
    }, ONE_SECOND);

    return () => clearInterval(id);
  }, [onTimeElapsed, duration, entityStartedAt]);

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
        // These values are not supported for the fontFamily prop, but I'm not
        // sure what they should be
        // fontFamily="Atkinson Hyperlegible Regular"
      >
        {formattedTimeLeft}
      </Text>
    </XStack>
  );
};
