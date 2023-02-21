import React, { FC } from 'react';

import { format, getLast7Dates } from '@shared/lib';
import { Text, YStack, Box, XStack, BoxProps } from '@shared/ui';

const HorizontalCalendar: FC<BoxProps> = styledProps => {
  const currentDate = new Date();
  const title = format(currentDate, 'MMMM Y');
  const dates = getLast7Dates();

  return (
    <Box alignItems="center" {...styledProps}>
      <Text fontSize={15} mb={20}>
        {title}
      </Text>

      <XStack space={6}>
        {dates.map(date => {
          const dateOfMonth = date.getDate();
          const weekDayName = format(date, 'EE').toUpperCase();

          const isToday = currentDate.getDate() === dateOfMonth;
          const textColor = isToday ? '$black' : '$grey';

          return (
            <YStack
              key={dateOfMonth}
              px={14}
              py={6}
              br={50}
              ai="center"
              jc="center"
              bg={isToday ? '$lightBlue' : 'transparent'}
            >
              <Text mb="$1" fontSize={10} color={textColor}>
                {weekDayName}
              </Text>

              <Text color={textColor} fontWeight="700">
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
