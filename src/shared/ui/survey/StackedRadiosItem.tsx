import { FC } from 'react';

import { colors } from '@app/shared/lib';

import {
  Item,
  StackedItemsGrid,
  StackedRowItemValue,
} from './StackedItemsGrid';
import { RadioGroup } from '../';

type StackedRadioConfig = {
  rows: Array<Item>;
  options: Array<Item>;
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

    values.length = config.rows.length;
    values[itemIndex] = { rowId: currentRowId, ...option };

    onChange(values);
  };

  return (
    <StackedItemsGrid
      items={config.rows}
      renderCell={(index, option) => {
        const { id: currentRowId } = config.rows[index];
        const currentValue = values.find(value => {
          return value?.rowId === currentRowId;
        });

        return (
          <RadioGroup
            key={option.id + currentRowId}
            value={currentValue?.id ?? ''}
          >
            <RadioGroup.Item
              onPress={() => onRowValueChange(option, index)}
              borderColor={colors.blue}
              value={option.id}
            >
              <RadioGroup.Indicator backgroundColor={colors.blue} />
            </RadioGroup.Item>
          </RadioGroup>
        );
      }}
      options={config.options}
    />
  );
};

export default StackedRadios;
