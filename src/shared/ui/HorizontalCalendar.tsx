import React, { FC } from 'react';

import { format, getLast7Dates } from '@shared/lib';
import { Text, YStack, Box, XStack, BoxProps } from '@shared/ui';

const HorizontalCalendar: FC<BoxProps> = styledProps => {
  const currentDate = new Date();
  const title = format(currentDate, 'MMMM Y');
  const dates = getLast7Dates();

  return (
    <Box alignItems="center" {...styledProps}>
      <Text accessibilityLabel="calendar-title" fontSize={15} mb={20}>
        {title}
      </Text>

      <XStack
        accessibilityLabel="calendar-dates-container"
        px={6}
        jc="space-around"
        width="100%"
      >
        {dates.map(date => {
          const dateOfMonth = date.getDate();
          const weekDayName = format(date, 'EE').toUpperCase();

          const isToday = currentDate.getDate() === dateOfMonth;
          const textColor = isToday ? '$black' : '$grey';

          return (
            <YStack
              key={dateOfMonth}
              accessibilityLabel="calendar-item"
              px={14}
              py={6}
              br={50}
              ai="center"
              jc="center"
              bg={isToday ? '$lightBlue' : 'transparent'}
            >
              <Text
                accessibilityLabel="calendar-week-name"
                mb="$1"
                fontSize={10}
                color={textColor}
              >
                {weekDayName}
              </Text>

              <Text
                accessibilityLabel="calendar-day-of-month"
                color={textColor}
                fontWeight="700"
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

export default HorizontalCalendar;
