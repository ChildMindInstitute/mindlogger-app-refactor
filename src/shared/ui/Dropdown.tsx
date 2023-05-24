import { StyleSheet } from 'react-native';

import SelectDropdown from 'react-native-select-dropdown';

import { colors } from '../lib';

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
    <SelectDropdown
      data={items}
      dropdownStyle={styles.dropdown}
      buttonStyle={styles.button}
      defaultButtonText={value ? value.value : placeholder}
      defaultValue={value ? value.value : placeholder}
      onSelect={onChange}
      buttonTextAfterSelection={() => (value ? value.value : placeholder)}
      rowTextForSelection={item => item.label}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: 'white',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.lightGrey,
    color: 'white',
  },
  button: {
    fontSize: 13,
    width: '100%',
    backgroundColor: 'transparent',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.grey,
    color: colors.grey,
  },
  label: {
    fontSize: 13,
    color: colors.grey,
  },
});

export default Dropdown;
