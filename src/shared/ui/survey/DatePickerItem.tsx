import { FC, useMemo } from 'react';

import { format } from 'date-fns';

import { colors } from '@app/shared/lib';
import { RightArrowIcon, DateTimePicker } from '@shared/ui';

type Props = {
  onChange: (value: string) => void;
  value?: string | null;
};

const DatePickerItem: FC<Props> = ({ value, onChange }) => {
  const onChangeDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    onChange(formattedDate);
  };

  const valueAsDate = useMemo(() => {
    if (!value) {
      return new Date();
    }
    const [year, month, day] = value.split('-');

    return new Date(Number(year), Number(month) - 1, Number(day));
  }, [value]);

  return (
    <DateTimePicker
      accessibilityLabel="date-picker"
      onChange={onChangeDate}
      value={valueAsDate}
      iconAfter={<RightArrowIcon color={colors.lightGrey2} size={15} />}
    />
  );
};

export default DatePickerItem;
