import { FC } from 'react';

import { CalendarProvider, ExpandableCalendar } from 'react-native-calendars';

import { format } from '@app/shared/lib';
import { Text, YStack, Box } from '@shared/ui/index';

const HorizontalCalendar: FC = () => {
  const currentDate = new Date();
  const weekDayString = format(currentDate, 'i');
  const weekDay = Number(weekDayString);

  const firstDay = weekDay > 6 ? weekDay - 6 : weekDay + 1;
  const title = format(currentDate, 'MMMM Y');

  return (
    <Box h={90}>
      <CalendarProvider date={currentDate.toISOString()}>
        <ExpandableCalendar
          customHeaderTitle={
            <Text mt="$1" fontSize={15}>
              {title}
            </Text>
          }
          dayComponent={({ date, state }) => {
            const bg =
              state === 'today' || state === 'selected'
                ? '$lightBlue'
                : '$secondary';
            const color = state === 'disabled' ? '$grey' : '$black';
            const weekDayName = format(date!.timestamp, 'EE').toUpperCase();

            return (
              <Box h={70}>
                <YStack
                  mt={-50}
                  w={45}
                  h={45}
                  px={8}
                  py={8}
                  br={45}
                  ai="center"
                  jc="center"
                  bg={bg}
                >
                  <Text mb="$1" fontSize={10} color={color}>
                    {weekDayName}
                  </Text>

                  <Text color={color} fontWeight="700">
                    {date!.day}
                  </Text>
                </YStack>
              </Box>
            );
          }}
          horizontal={true}
          minDate={currentDate.toISOString()}
          hideArrows
          disablePan
          hideKnob
          disableWeekScroll
          firstDay={firstDay}
        />
      </CalendarProvider>
    </Box>
  );
};

export default HorizontalCalendar;
