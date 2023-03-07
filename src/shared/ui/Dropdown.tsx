import { StyleSheet } from 'react-native';

import { DropdownElement } from '.';

export type LabeledValue = {
  label: string;
  value: string;
};

type DropdownProps = {
  placeholder: string;
  items: LabeledValue[];
  value?: LabeledValue;
  onValueChange: (value: string) => void;
};

function Dropdown({ placeholder, value, onValueChange, items }: DropdownProps) {
  const onChange = (item: LabeledValue) => {
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
}

const styles = StyleSheet.create({
  centerAlignedText: {
    textAlign: 'center',
  },
  iconStyle: {
    display: 'none',
  },
});

export default Dropdown;
