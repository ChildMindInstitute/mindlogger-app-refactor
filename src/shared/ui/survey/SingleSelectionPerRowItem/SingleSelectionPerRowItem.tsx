import { FC } from 'react';

import { colors } from '@app/shared/lib';

import SelectionPerRowConfigType from './types';
import { RadioGroup } from '../..';
import { StackedItemsGrid } from '../StackedItemsGrid';

type SingleSelectionPerRowItemProps = {
  value: string[];
  onChange: (value: string[] | string) => unknown;
  config: SelectionPerRowConfigType;
};

const SingleSelectionPerRowItem: FC<SingleSelectionPerRowItemProps> = ({
  value = [],
  onChange,
  config,
}) => {
  const onRowValueChange = (option: string, itemIndex: number) => {
    value[itemIndex] = option;

    onChange(value);
  };

  return (
    <StackedItemsGrid
      items={config.itemList}
      onRowValueChange={onRowValueChange}
      renderCell={option => (
        <RadioGroup.Item borderColor={colors.blue} value={option.name.en}>
          <RadioGroup.Indicator backgroundColor={colors.blue} />
        </RadioGroup.Item>
      )}
      options={config.options}
    />
  );
};

export default SingleSelectionPerRowItem;
