import { FC, useMemo } from 'react';

import {
  HourMinute,
  colors,
  getMsFromHours,
  getMsFromMinutes,
} from '@shared/lib';
import { AlarmIcon, DateTimePicker } from '@shared/ui';

type Props = {
  onChange: (value: string) => void;
  value?: HourMinute;
};

const TimePickerItem: FC<Props> = ({ value, onChange }) => {
  const onChangeDate = (date: Date) => onChange(date.toString());

  const timeInMs = useMemo(
    () =>
      value
        ? getMsFromHours(value.hours) + getMsFromMinutes(value.minutes)
        : Date.now(),
    [value],
  );

  return (
    <DateTimePicker
      onChange={onChangeDate}
      value={new Date(timeInMs)}
      mode="time"
      iconAfter={<AlarmIcon color={colors.lightGrey} size={15} />}
    />
  );
};

export default TimePickerItem;
