import { useState, FC } from 'react';

import { Button } from '@tamagui/button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = {
  onChange: (value: string) => void;
  value: string;
};

const DatePickerItem: FC<Props> = ({ value, onChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn('A date has been picked: ', date);
    onChange(date.toString());
    hideDatePicker();
  };

  return (
    <>
      <Button onPress={showDatePicker}>{value}</Button>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DatePickerItem;
