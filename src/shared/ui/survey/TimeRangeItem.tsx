import { FC, useMemo } from 'react';

import { TIME_PICKER_FORMAT_PLACEHOLDER } from '@app/shared/lib/constants/dateTime';
import { palette } from '@app/shared/lib/constants/palette';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import {
  getMidnightDateInMs,
  getMsFromHours,
  getMsFromMinutes,
} from '@app/shared/lib/utils/dateTime';

import { YStack } from '../base';
import { DateTimePicker } from '../DateTimePicker';
import { ClockIcon, BedIcon } from '../icons';

type TimeRangeValue = {
  endTime: HourMinute | null;
  startTime: HourMinute | null;
};

type Props = {
  value?: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
};

export const TimeRangeItem: FC<Props> = ({ value, onChange }) => {
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
    () => (value?.startTime ? transformToDate(value.startTime) : null),
    [value],
  );

  const endTimeAsDate = useMemo(
    () => (value?.endTime ? transformToDate(value.endTime) : null),
    [value],
  );

  const onChangeStartTime = (time: Date) => {
    onChange({
      endTime: endTimeAsDate ? transformToHourMinute(endTimeAsDate) : null,
      startTime: transformToHourMinute(time),
    });
  };

  const onChangeEndTime = (time: Date) => {
    onChange({
      startTime: startTimeAsDate
        ? transformToHourMinute(startTimeAsDate)
        : null,
      endTime: transformToHourMinute(time),
    });
  };

  return (
    <YStack gap={20}>
      <DateTimePicker
        label="From"
        accessibilityLabel="time-picker-from-date"
        onChange={onChangeStartTime}
        dateDisplayFormat="h:mm a"
        value={startTimeAsDate}
        mode="time"
        iconAfter={<BedIcon color={palette.outline} size={16} />}
        placeholder={TIME_PICKER_FORMAT_PLACEHOLDER}
      />

      <DateTimePicker
        label="To"
        accessibilityLabel="time-picker-to-date"
        onChange={onChangeEndTime}
        dateDisplayFormat="h:mm a"
        mode="time"
        value={endTimeAsDate}
        iconAfter={<ClockIcon color={palette.outline} size={16} />}
        placeholder={TIME_PICKER_FORMAT_PLACEHOLDER}
      />
    </YStack>
  );
};
