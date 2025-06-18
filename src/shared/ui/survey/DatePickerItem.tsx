import { FC } from 'react';

import { format } from 'date-fns';

import { palette } from '@app/shared/lib/constants/palette';
import { DATE_PICKER_FORMAT_PLACEHOLDER } from '@app/shared/lib/constants/dateTime';
import { getDateFromString } from '@app/shared/lib/utils/dateTime';

import { DateTimePicker } from '../DateTimePicker';
import { RightArrowIcon } from '../icons';

type Props = {
  onChange: (value: string) => void;
  value?: string | null;
};

export const DatePickerItem: FC<Props> = ({ value, onChange }) => {
  const onChangeDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    onChange(formattedDate);
  };

  const valueAsDate = value ? getDateFromString(value) : null;

  return (
    <DateTimePicker
      accessibilityLabel="date-picker"
      onChange={onChangeDate}
      value={valueAsDate}
      iconAfter={<RightArrowIcon color={palette.lightGrey2} size={15} />}
      placeholder={DATE_PICKER_FORMAT_PLACEHOLDER}
    />
  );
};
