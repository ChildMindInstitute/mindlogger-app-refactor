import { FC } from 'react';

import { colors } from '@app/shared/lib';
import { AlarmIcon, DateTimePicker } from '@shared/ui';

type Props = {
  onChange: (value: string) => void;
  value?: string;
};

const TimePickerItem: FC<Props> = ({ value, onChange }) => {
  const onChangeDate = (date: Date) => onChange(date.toString());

  return (
    <DateTimePicker
      onChange={onChangeDate}
      value={value ? new Date(value) : new Date()}
      mode="time"
      iconAfter={<AlarmIcon color={colors.lightGrey} size={15} />}
    />
  );
};

export default TimePickerItem;
