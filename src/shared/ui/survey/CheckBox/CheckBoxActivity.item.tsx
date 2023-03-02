import { FC, useMemo } from 'react';

import { shuffle } from '@shared/lib';
import { Box, ScrollView } from '@shared/ui';

import CheckBoxItem from './CheckBox.item';
import { Item } from './types';

type Props = {
  // @todo make sure backend will update config to new keys described below (type RefactoredConfig in ./types)
  config: {
    items: Item[];
    minValue: number;
    maxValue: number;
    colorPalette: boolean;
    randomizeOptions: boolean;
  };
  onChange: (arrayOfValues: number[]) => void;
  values: number[];
};

const CheckBoxActivityItem: FC<Props> = ({ config, onChange, values }) => {
  const { minValue, maxValue } = config;
  const hasSingleItem = maxValue === 1 && minValue === 1;

  const { items, randomizeOptions } = config;

  const onItemValueChanged = (checkedItemValue: number) => {
    if (hasSingleItem) {
      onChange([checkedItemValue]);
    } else if (values.includes(checkedItemValue)) {
      const filteredValues = values.filter(val => val !== checkedItemValue);
      onChange(filteredValues);
    } else {
      onChange([...values, checkedItemValue]);
    }
  };

  const mutatedItems = useMemo(() => {
    const filteredItems = items.filter(({ isVisible }) => isVisible);
    if (randomizeOptions) {
      return shuffle(filteredItems);
    }

    return filteredItems;
  }, [randomizeOptions, items]);

  return (
    <ScrollView>
      {mutatedItems.map(item => {
        return (
          <Box key={`checkbox-${item.value}`}>
            <CheckBoxItem
              {...item}
              colorPalette={config.colorPalette}
              onChange={onItemValueChanged}
              checked={values.includes(item.value)}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
