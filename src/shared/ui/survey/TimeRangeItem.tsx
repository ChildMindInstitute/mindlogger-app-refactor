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
  const transformIntoDate = (hourMinute: HourMinute): Date => {
    const msTime =
      getMidnightDateInMs() +
      getMsFromHours(hourMinute.hours) +
      getMsFromMinutes(hourMinute.minutes);

    return new Date(msTime);
  };

  const transformIntoHourMinute = (time: Date): HourMinute => ({
    minutes: time.getMinutes(),
    hours: time.getHours(),
  });

  const startTimeAsDate = useMemo(
    () => (value?.startTime ? transformIntoDate(value.startTime) : new Date()),
    [value],
  );

  const endTimeAsDate = useMemo(
    () => (value?.endTime ? transformIntoDate(value.endTime) : new Date()),
    [value],
  );

  const onChangeStartTime = (time: Date) =>
    onChange({
      endTime: transformIntoHourMinute(endTimeAsDate),
      startTime: transformIntoHourMinute(time),
    });

  const onChangeEndTime = (time: Date) =>
    onChange({
      startTime: transformIntoHourMinute(startTimeAsDate),
      endTime: transformIntoHourMinute(time),
    });

  return (
    <YStack>
      <DateTimePicker
        label="From"
        onChange={onChangeStartTime}
        dateDisplayFormat="h:mm a"
        value={startTimeAsDate}
        mode="time"
        iconAfter={<BedIcon color={colors.grey2} size={15} />}
      />

      <DateTimePicker
        label="To"
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
