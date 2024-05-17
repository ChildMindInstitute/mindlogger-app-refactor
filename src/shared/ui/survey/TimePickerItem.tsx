import { FC, useMemo } from 'react';

import {
  HourMinute,
  colors,
  getMsFromHours,
  getMidnightDateInMs,
  getMsFromMinutes,
  getNow,
  TIME_PICKER_FORMAT_PLACEHOLDER,
} from '@shared/lib';
import { AlarmIcon, DateTimePicker } from '@shared/ui';

type Props = {
  onChange: (value: HourMinute) => void;
  value?: HourMinute;
};

const TimePickerItem: FC<Props> = ({ value, onChange }) => {
  const onChangeDate = (date: Date) =>
    onChange({
      minutes: date.getMinutes(),
      hours: date.getHours(),
    });

  const timeInMs = useMemo(
    () =>
      value
        ? getMidnightDateInMs(getNow()) +
          getMsFromHours(value.hours) +
          getMsFromMinutes(value.minutes)
        : null,
    [value],
  );

  return (
    <DateTimePicker
      accessibilityLabel="time-picker"
      onChange={onChangeDate}
      value={timeInMs ? new Date(timeInMs) : null}
      dateDisplayFormat="hh:mm aa"
      mode="time"
      iconAfter={<AlarmIcon color={colors.lightGrey} size={15} />}
      placeholder={TIME_PICKER_FORMAT_PLACEHOLDER}
    />
  );
};

export default TimePickerItem;
