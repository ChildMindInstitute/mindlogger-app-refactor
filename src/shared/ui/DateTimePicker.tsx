import { useState, FC } from 'react';
import { AccessibilityProps } from 'react-native';

import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { XStack, Text } from '.';

type Props = {
  onChange: (value: Date) => void;
  value: Date | null;
  iconAfter: JSX.Element;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
  dateDisplayFormat?: string;
  placeholder: string;
};

const DatePickerButton = styled(Button, {
  borderBottomColor: '$lightGrey',
  borderBottomWidth: 1,
  borderRadius: 0,
  backgroundColor: '$white',
});

const DateTimePicker: FC<Props & AccessibilityProps> = ({
  value,
  accessibilityLabel,
  onChange,
  label,
  iconAfter,
  placeholder,
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
    hideDatePicker();
    onChange(date);
  };

  return (
    <>
      {label && (
        <Text color="$lightGrey" mb={8}>
          {label}
        </Text>
      )}

      <DatePickerButton
        accessibilityLabel={accessibilityLabel}
        onPress={showDatePicker}
        iconAfter={iconAfter}
      >
        <XStack flex={1}>
          <Text>{value ? format(value, dateDisplayFormat) : placeholder}</Text>
        </XStack>
      </DatePickerButton>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={value ? new Date(value) : new Date()}
        mode={mode}
        onConfirm={confirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DateTimePicker;
