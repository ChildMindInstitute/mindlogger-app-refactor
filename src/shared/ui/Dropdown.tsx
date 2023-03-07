import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { DropdownElement } from '.';

export type LabeledValue<TValue extends string | number = string> = {
  label: string;
  value: TValue;
};

type DropdownProps = {
  placeholder: string;
  items: LabeledValue[];
  value?: LabeledValue;
  onValueChange: (value: number | string) => void;
};

const Dropdown: FC<DropdownProps> = ({
  placeholder,
  value = '',
  onValueChange,
  items,
}) => {
  const onChange = (item: {
    label: string | number;
    value: string | number;
  }) => {
    onValueChange(item.value);
  };

  return (
    <DropdownElement
      maxHeight={300}
      placeholder={placeholder}
      iconStyle={styles.iconStyle}
      selectedTextStyle={styles.centerAlignedText}
      placeholderStyle={styles.centerAlignedText}
      itemTextStyle={styles.centerAlignedText}
      value={value}
      data={items}
      labelField="label"
      valueField="value"
      onChange={onChange}
    />
  );
};

const styles = StyleSheet.create({
  centerAlignedText: {
    textAlign: 'center',
  },
  iconStyle: {
    display: 'none',
  },
});

export default Dropdown;
