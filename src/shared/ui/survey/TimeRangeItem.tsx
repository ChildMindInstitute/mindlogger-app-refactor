import { FC, useMemo } from 'react';

import {
  HourMinute,
  colors,
  getMidnightDateInMs,
  getMsFromHours,
  getMsFromMinutes,
} from '@app/shared/lib';
import { YStack, DateTimePicker, AlarmIcon, BedIcon } from '@shared/ui';

type TimeRangeValue = {
  endTime: HourMinute;
  startTime: HourMinute;
};

type Props = {
  value?: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
};

const TimeRangeItem: FC<Props> = ({ value, onChange }) => {
  const transformToDate = (hourMinute: HourMinute): Date => {
    const msTime =
      getMidnightDateInMs() +
      getMsFromHours(hourMinute.hours) +
      getMsFromMinutes(hourMinute.minutes);

    return new Date(msTime);
  };

  const transformToHourMinute = (time: Date): HourMinute => ({
    minutes: time.getMinutes(),
    hours: time.getHours(),
  });

  const startTimeAsDate = useMemo(
    () => (value?.startTime ? transformToDate(value.startTime) : new Date()),
    [value],
  );

  const endTimeAsDate = useMemo(
    () => (value?.endTime ? transformToDate(value.endTime) : new Date()),
    [value],
  );

  const onChangeStartTime = (time: Date) =>
    onChange({
      endTime: transformToHourMinute(endTimeAsDate),
      startTime: transformToHourMinute(time),
    });

  const onChangeEndTime = (time: Date) =>
    onChange({
      startTime: transformToHourMinute(startTimeAsDate),
      endTime: transformToHourMinute(time),
    });

  return (
    <YStack>
      <DateTimePicker
        label="From"
        data-test="time-picker-from-date"
        onChange={onChangeStartTime}
        dateDisplayFormat="h:mm a"
        value={startTimeAsDate}
        mode="time"
        iconAfter={<BedIcon color={colors.grey2} size={15} />}
      />

      <DateTimePicker
        label="To"
        data-test="time-picker-to-date"
        onChange={onChangeEndTime}
        dateDisplayFormat="h:mm a"
        mode="time"
        value={endTimeAsDate}
        iconAfter={<AlarmIcon color={colors.grey2} size={15} />}
      />
    </YStack>
  );
};

export default TimeRangeItem;
