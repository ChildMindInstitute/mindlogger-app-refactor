import { FC } from 'react';
import { StyleSheet } from 'react-native';

import { colors, range } from '@app/shared/lib';

import { CheckBox, YStack } from '../..';
import { StackedItemsGrid, StackedRowItemValue } from '../StackedItemsGrid';

type StackedCheckboxConfig = {
  rows: Array<StackedRowItemValue>;
  options: Array<StackedRowItemValue>;
};

type Props = {
  value: string[][] | null;
  onChange: (value: string[][] | null) => void;
  config: StackedCheckboxConfig;
};
const StackedCheckboxItem: FC<Props> = ({ value, onChange, config }) => {
  if (value == null) {
    value = [];
  }
  const onValueChange = (option: StackedRowItemValue, rowIndex: number) => {
    let newValue = range(config.options.length).map((_, i) => value![i] ?? []);
    const row = newValue[rowIndex];
    if (row.includes(option.id)) {
      newValue[rowIndex] = row.filter(id => id !== option.id);
    } else {
      newValue[rowIndex].push(option.id);
    }
    const isEmpty = newValue.every(r => !r.length);

    onChange(isEmpty ? null : newValue);
  };
  console.log(config.rows, config.options);
  return (
    <>
      <StackedItemsGrid
        items={config.rows}
        options={config.options}
        renderCell={(index, option) => {
          return (
            <YStack onPress={() => onValueChange(option, index)}>
              <CheckBox
                style={styles.checkbox}
                lineWidth={2}
                animationDuration={0.2}
                boxType="square"
                tintColors={{ true: colors.primary, false: colors.primary }}
                onCheckColor={colors.white}
                onFillColor={colors.primary}
                onTintColor={colors.primary}
                tintColor={colors.primary}
                onAnimationType="bounce"
                offAnimationType="bounce"
                value={!!value![index]?.includes(option.id)}
                disabled
              />
            </YStack>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    height: 20,
    width: 20,
  },
});
export default StackedCheckboxItem;
