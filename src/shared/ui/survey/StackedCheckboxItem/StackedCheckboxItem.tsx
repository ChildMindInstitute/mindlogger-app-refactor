import { FC } from 'react';
import { StyleSheet } from 'react-native';

import StackedCheckboxConfig from './types';
import { CheckBox } from '../..';
import { StackedItemsGrid } from '../StackedItemsGrid';
import { StackedRowItemValue } from '../StackedItemsGrid/types';

type Props = {
  value: Array<string[]>;
  onChange: (value: Array<string[]>) => void;
  config: StackedCheckboxConfig;
};

const StackedCheckboxItem: FC<Props> = ({ value = [], onChange, config }) => {
  const onValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    if (!value[itemIndex]?.length) {
      value[itemIndex] = [];
    }

    if (value[itemIndex].includes(option.name)) {
      value[itemIndex] = value[itemIndex].filter(
        valueItem => valueItem !== option.name,
      );
    } else {
      value[itemIndex].push(option.name);
    }

    onChange(value);
  };

  return (
    <StackedItemsGrid
      items={config.itemList}
      options={config.options}
      renderCell={(option, index) => (
        <CheckBox
          style={styles.checkbox}
          onChange={() => onValueChange(option, index)}
          boxType="square"
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  checkbox: {
    height: 20,
    width: 20,
  },
});

export default StackedCheckboxItem;
