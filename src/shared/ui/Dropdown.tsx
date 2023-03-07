import { StyleSheet } from 'react-native';

import { DropdownElement } from '.';

export type LabeledValue<TValue extends string | number> = {
  label: string;
  value: TValue;
};

type DropdownProps<TValue extends string | number> = {
  placeholder: string;
  items: LabeledValue<TValue>[];
  value?: LabeledValue<TValue>;
  onValueChange: (value: TValue) => void;
};

function Dropdown<TValue extends string | number>({
  placeholder,
  value,
  onValueChange,
  items,
}: DropdownProps<TValue>) {
  const onChange = (item: LabeledValue<TValue>) => {
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
