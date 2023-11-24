import { FC, useMemo } from 'react';

import {
  HourMinute,
  colors,
  getMsFromHours,
  getMidnightDateInMs,
  getMsFromMinutes,
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
        ? getMidnightDateInMs() +
          getMsFromHours(value.hours) +
          getMsFromMinutes(value.minutes)
        : Date.now(),
    [value],
  );

  return (
    <DateTimePicker
      accessibilityLabel="time-picker"
      onChange={onChangeDate}
      value={new Date(timeInMs)}
      dateDisplayFormat="hh:mm aa"
      mode="time"
      iconAfter={<AlarmIcon color={colors.lightGrey} size={15} />}
    />
  );
};

export default TimePickerItem;
