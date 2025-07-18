import { FC, useMemo } from 'react';

import { TIME_PICKER_FORMAT_PLACEHOLDER } from '@app/shared/lib/constants/dateTime';
import { palette } from '@app/shared/lib/constants/palette';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import {
  getMidnightDateInMs,
  getNow,
  getMsFromHours,
  getMsFromMinutes,
} from '@app/shared/lib/utils/dateTime';

import { DateTimePicker } from '../DateTimePicker';
import { ClockIcon } from '../icons';

type Props = {
  onChange: (value: HourMinute) => void;
  value?: HourMinute;
};

export const TimePickerItem: FC<Props> = ({ value, onChange }) => {
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
      iconAfter={<ClockIcon color={palette.outline} size={16} />}
      placeholder={TIME_PICKER_FORMAT_PLACEHOLDER}
    />
  );
};
