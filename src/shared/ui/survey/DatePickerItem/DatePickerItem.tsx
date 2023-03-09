import { useState, FC } from 'react';

import { Button } from '@tamagui/button';
import { styled } from '@tamagui/core';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { colors } from '@app/shared/lib';

import { XStack, Text, ChevronRightIcon } from '../..';

type Props = {
  onChange: (value: string) => void;
  value: string;
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

  const confirm = (date: Date) => {
    onChange(date.toString()); // @todo add correct date format after backend implementation
    hideDatePicker();
  };

  return (
    <>
      <DatePickerButton
        onPress={showDatePicker}
        iconAfter={<ChevronRightIcon color={colors.grey} size={15} />}
      >
        <XStack flex={1}>
          <Text>{format(new Date(value), 'MMMM d, yyyy')}</Text>
        </XStack>
      </DatePickerButton>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={new Date(value)}
        mode="date"
        onConfirm={confirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DatePickerItem;
