import { useState, FC } from 'react';

import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { colors } from '@app/shared/lib';

import { XStack, Text, ChevronRightIcon } from '../..';

type Props = {
  onChange: (value: Date) => void;
  value: Date;
};

const DatePickerButton = styled(Button, {
  borderBottomColor: '$lightGrey',
  borderBottomWidth: 1,
  borderRadius: 0,
});

const DatePickerItem: FC<Props> = ({ value = new Date(), onChange }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    onChange(date); // @todo add correct date format after backend implementation
    hideDatePicker();
  };

  return (
    <>
      <DatePickerButton
        onPress={showDatePicker}
        iconAfter={<ChevronRightIcon color={colors.grey} size={15} />}
      >
        <XStack flex={1}>
          <Text>{format(value, 'MMMM d, yyyy')}</Text>
        </XStack>
      </DatePickerButton>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={value}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DatePickerItem;
