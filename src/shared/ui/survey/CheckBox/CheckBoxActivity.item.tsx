import { FC, useMemo } from 'react';

import { shuffle } from '@shared/lib';
import { Box, ScrollView } from '@shared/ui';

import CheckBoxItem from './CheckBox.item';
import { Item } from './types';

type Props = {
  config: {
    options: Item[];
    randomizeOptions: boolean;
    addTooltip: boolean;
    setPalette: boolean;
    setAlerts: boolean;
  };
  onChange: (values: string[]) => void;
  values: string[];
};

const CheckBoxActivityItem: FC<Props> = ({ config, onChange, values }) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;
  const hasSingleItem = options.length === 1;

  const onItemValueChanged = (checkedItemValue: string) => {
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
    const filteredItems = options.filter(({ isHidden }) => !isHidden);
    if (randomizeOptions) {
      return shuffle(filteredItems);
    }

    return filteredItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomizeOptions]);

  return (
    <ScrollView>
      {mutatedItems.map(item => {
        return (
          <Box key={`checkbox-${item.id}`}>
            <CheckBoxItem
              {...item}
              tooltipAvailable={addTooltip}
              setPalette={setPalette}
              onChange={() => onItemValueChanged(item.id)}
              value={values.includes(item.id)}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
