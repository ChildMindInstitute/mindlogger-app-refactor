import { FC } from 'react';

import { colors } from '@app/shared/lib';
import { ChevronRightIcon, DateTimePicker } from '@shared/ui';

type Props = {
  onChange: (value: string) => void;
  value: string;
};

const DatePickerItem: FC<Props> = ({ value, onChange }) => {
  return (
    <DateTimePicker
      onChange={onChange}
      value={new Date(value)}
      iconAfter={<ChevronRightIcon color={colors.grey} size={15} />}
    />
  );
};

export default DatePickerItem;
