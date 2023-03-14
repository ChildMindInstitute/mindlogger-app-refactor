import { useState, FC } from 'react';

import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { XStack, Text } from '.';

type Props = {
  onChange: (value: string) => void;
  value: Date;
  iconAfter: JSX.Element;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
  dateDisplayFormat?: string;
};

const DatePickerButton = styled(Button, {
  borderBottomColor: '$lightGrey',
  borderBottomWidth: 1,
  borderRadius: 0,
});

const DateTimePicker: FC<Props> = ({
  value = new Date(),
  onChange,
  label,
  iconAfter,
  mode = 'date',
  dateDisplayFormat = 'MMMM d, yyyy',
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const confirm = (date: Date) => {
    onChange(date.toString()); // @todo add correct date format after backend implementation
    hideDatePicker();
  };

  return (
    <>
      {label && (
        <Text color="$lightGrey" mb={8}>
          {label}
        </Text>
      )}

      <DatePickerButton onPress={showDatePicker} iconAfter={iconAfter}>
        <XStack flex={1}>
          <Text>{format(value, dateDisplayFormat)}</Text>
        </XStack>
      </DatePickerButton>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={new Date(value)}
        mode={mode}
        onConfirm={confirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DateTimePicker;
