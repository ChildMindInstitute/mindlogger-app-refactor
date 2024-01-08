import { FC } from 'react';

import { colors } from '@app/shared/lib';

import {
  StackedItem,
  StackedItemsGrid,
  StackedRowItemValue,
} from './StackedItemsGrid';
import { RadioGroup } from '../';

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
};

const StackedRadios: FC<Props> = ({ values, onChange, config }) => {
  const onRowValueChange = (option: StackedRowItemValue, itemIndex: number) => {
    const { id: currentRowId } = config.rows[itemIndex];
    const newValue = [...values];

    newValue.length = config.rows.length;
    newValue[itemIndex] = { rowId: currentRowId, ...option };

    onChange(newValue);
  };

  return (
    <StackedItemsGrid
      items={config.rows}
      accessibilityLabel="stack-radio-container"
      renderCell={(rowIndex, option) => {
        const { id: currentRowId } = config.rows[rowIndex];
        const currentValue = values.find(value => {
          return value?.rowId === currentRowId;
        });

        const optionIndex = config.options.indexOf(option);

        return (
          <RadioGroup
            key={option.id + currentRowId}
            value={currentValue?.id ?? ''}
            accessibilityLabel="stack-radio-group"
          >
            <RadioGroup.Item
              accessibilityLabel={`stacked-radio-item-${optionIndex}-${rowIndex}`}
              onPress={() => onRowValueChange(option, rowIndex)}
              borderColor={colors.blue}
              value={option.id}
            >
              <RadioGroup.Indicator
                accessibilityLabel="stack-radio-indicator"
                backgroundColor={colors.blue}
              />
            </RadioGroup.Item>
          </RadioGroup>
        );
      }}
      options={config.options}
    />
  );
};

export default StackedRadios;
