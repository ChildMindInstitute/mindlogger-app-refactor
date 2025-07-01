import { FC, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { palette } from '@app/shared/lib/constants/palette';
import { getSelectorColors } from '@app/shared/lib/utils/survey/survey';

import { YStack } from '../../base';
import { CheckBox } from '../../CheckBox';
import { StackedItemsGrid } from '../StackedItemsGrid/StackedItemsGrid';
import { StackedItem, StackedRowItemValue } from '../StackedItemsGrid/types';

type StackedCheckboxConfig = {
  rows: Array<StackedItem>;
  options: Array<StackedItem>;
};

type Values = Array<Array<StackedItem>>;

type Props = {
  values: Values | null;
  onChange: (value: Values | null) => void;
  config: StackedCheckboxConfig;
  tooltipsShown: boolean;
  textReplacer: (markdown: string) => string;
};

export const StackedCheckboxItem: FC<Props> = ({
  values,
  onChange,
  config,
  textReplacer,
  tooltipsShown,
}) => {
  const { options, rows } = config;

  const memoizedOptions: StackedRowItemValue[] = useMemo(() => {
    return options.map(option => {
      return {
        ...option,
        tooltip: tooltipsShown ? textReplacer(option.tooltip || '') : '',
      };
    });
  }, [tooltipsShown, options, textReplacer]);

  const memoizedRows = useMemo(() => {
    return rows.map(row => {
      return {
        ...row,
        tooltip: tooltipsShown ? textReplacer(row.tooltip || '') : '',
      };
    });
  }, [tooltipsShown, rows, textReplacer]);

  const isValueSelected = (value: StackedItem, rowIndex: number) => {
    if (!values || !values[rowIndex]?.length) {
      return false;
    }

    const selectedValue = values[rowIndex].find(item => item.id === value.id);

    return !!selectedValue;
  };

  const onValueChange = (option: StackedRowItemValue, rowIndex: number) => {
    let newValues: Values = [];
    if (!values) {
      newValues.length = config.rows.length;
      newValues[rowIndex] = [option];
    } else {
      newValues = [...values];

      newValues[rowIndex] = isValueSelected(option, rowIndex)
        ? newValues[rowIndex].filter(value => value.id !== option.id)
        : [...(newValues[rowIndex] ? newValues[rowIndex] : []), option];
    }

    onChange(newValues);
  };

  return (
    <>
      <StackedItemsGrid
        items={memoizedRows}
        options={memoizedOptions}
        accessibilityLabel="stacked-checkbox-container"
        renderCell={(rowIndex, option) => {
          const optionIndex = memoizedOptions.indexOf(option);

          const selected = isValueSelected(option, rowIndex);
          const { widgetColor } = getSelectorColors({
            setPalette: false,
            color: null,
            selected,
          });

          return (
            <YStack
              hitSlop={15}
              onPress={() => onValueChange(option, rowIndex)}
            >
              <CheckBox
                style={Platform.select({
                  ios: styles.checkboxIOS,
                  android: styles.checkboxAndroid,
                })}
                accessibilityLabel={`stacked-checkbox-option-${optionIndex}-${rowIndex}`}
                lineWidth={2}
                animationDuration={0.2}
                boxType="square"
                tintColors={{
                  true: widgetColor,
                  false: widgetColor,
                }}
                onCheckColor={palette.surface}
                onFillColor={widgetColor}
                onTintColor={widgetColor}
                tintColor={widgetColor}
                onAnimationType="bounce"
                offAnimationType="bounce"
                value={isValueSelected(option, rowIndex)}
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
  checkboxIOS: {
    width: 21,
    height: 21,
  },
  checkboxAndroid: {
    width: 21,
    height: 21,
    left: -6,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
