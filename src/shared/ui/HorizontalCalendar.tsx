import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, BoxProps, XStack, YStack } from './base';
import { Text } from './Text';
import { IS_SMALL_WIDTH_SCREEN } from '../lib/constants';
import { format, getLast7Dates } from '../lib/utils/dateTime';

export const HorizontalCalendar: FC<BoxProps> = styledProps => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const title = format(currentDate, 'MMMM y');
  const dates = getLast7Dates();

  const daySize = IS_SMALL_WIDTH_SCREEN ? 44 : 50;

  // Get weekday abbreviations from translations instead of date-fns locale
  const weekdays = t('calendar:weekdays').split('_');

  return (
    <Box gap={8} pt={16} px={16} {...styledProps}>
      <Text aria-label="calendar-title" fontSize={22} lineHeight={28} px={8}>
        {title}
      </Text>

      <XStack aria-label="calendar-dates-container" jc="space-around">
        {dates.map(date => {
          const dateOfMonth = date.getDate();
          const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
          const weekDayName = weekdays[dayIndex].toUpperCase();

          const isToday = currentDate.getDate() === dateOfMonth;
          const textColor = isToday ? '$primary' : '$outline';

          return (
            <YStack
              key={dateOfMonth}
              aria-label="calendar-item"
              width={daySize}
              height={daySize}
              ai="center"
              jc="center"
              br={999}
              bg={isToday ? '$secondary_container' : 'transparent'}
            >
              <Text
                aria-label="calendar-week-name"
                fontSize={11}
                lineHeight={16}
                letterSpacing={0.5}
                color={textColor}
              >
                {weekDayName}
              </Text>

              <Text
                aria-label="calendar-day-of-month"
                fontSize={20}
                lineHeight={18}
                color={textColor}
              >
                {dateOfMonth}
              </Text>
            </YStack>
          );
        })}
      </XStack>
    </Box>
  );
};
