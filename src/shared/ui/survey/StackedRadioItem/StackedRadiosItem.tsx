import { FC, useMemo } from 'react';

import { colors } from '@app/shared/lib';

import { RadioGroup } from '../..';
import { StackedItem, StackedItemsGrid, StackedRowItemValue } from '../StackedItemsGrid';

type StackedRadioConfig = {
  rows: Array<StackedItem>;
  options: Array<StackedItem>;
};

type StackedRadioAnswerValue = StackedRowItemValue & {
  rowId: string;
};

type Props = {
  values: Array<StackedRadioAnswerValue>;
  onChange: (value: Array<StackedRadioAnswerValue>) => unknown;
  config: StackedRadioConfig;
  tooltipsShown: boolean;
  textReplacer: (markdown: string) => string;
};

const StackedRadios: FC<Props> = ({ values, onChange, config, textReplacer, tooltipsShown }) => {
  const { options, rows } = config;

  const onRowValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    const { id: currentRowId } = config.rows[itemIndex];
    const newValue = [...values];

    newValue.length = config.rows.length;
    newValue[itemIndex] = { rowId: currentRowId, ...option };

    onChange(newValue);
  };

  const memoizedOptions: StackedRowItemValue[] = useMemo(() => {
    return options.map((option) => {
      return {
        ...option,
        tooltip: tooltipsShown ? textReplacer(option.tooltip || '') : '',
      };
    });
  }, [tooltipsShown, options, textReplacer]);

  const memoizedRows = useMemo(() => {
    return rows.map((row) => {
      return {
        ...row,
        tooltip: tooltipsShown ? textReplacer(row.tooltip || '') : '',
      };
    });
  }, [tooltipsShown, rows, textReplacer]);

  return (
    <StackedItemsGrid
      items={memoizedRows}
      options={memoizedOptions}
      accessibilityLabel="stack-radio-container"
      renderCell={(rowIndex, option) => {
        const { id: currentRowId } = config.rows[rowIndex];
        const currentValue = values.find((value) => {
          return value?.rowId === currentRowId;
        });

        const optionIndex = config.options.findIndex((o) => o.id === option.id);

        return (
          <RadioGroup
            key={option.id + currentRowId}
            value={currentValue?.id ?? ''}
            accessibilityLabel="stack-radio-group"
          >
            <RadioGroup.Item
              accessibilityLabel={`stacked-radio-item-${optionIndex}-${rowIndex}`}
              data-test={`stack-radio-item-${option.id}-${currentRowId}`}
              onPress={() => onRowValueChange(option, rowIndex)}
              borderColor={colors.blue}
              value={option.id}
            >
              <RadioGroup.Indicator accessibilityLabel="stack-radio-indicator" backgroundColor={colors.blue} />
            </RadioGroup.Item>
          </RadioGroup>
        );
      }}
    />
  );
};

export default StackedRadios;
