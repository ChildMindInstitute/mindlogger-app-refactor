import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { DropdownElement } from '.';

type DropdownProps = {
  placeholder: string;
  items: Array<number | string>;
  value?: number | string;
  onValueChange: (value: number | string) => void;
};

const Dropdown: FC<DropdownProps> = ({
  placeholder,
  value = '',
  onValueChange,
  items,
}) => {
  const mappedItems = useMemo(
    () => items.map(item => ({ label: item, value: item })),
    [items],
  );

  const mappedValue = useMemo(() => ({ label: value, value }), [value]);

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
      value={mappedValue}
      data={mappedItems}
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
