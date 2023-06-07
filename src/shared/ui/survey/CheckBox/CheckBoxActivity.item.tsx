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
  onChange: (values: Item[] | null) => void;
  values: Item[];
  textReplacer: (markdown: string) => string;
};

const CheckBoxActivityItem: FC<Props> = ({
  config,
  onChange,
  values,
  textReplacer,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;

  const findById = (id: string): Item | undefined => {
    return values.find(val => val.id === id);
  };

  const onItemValueChanged = (checkedItemValue: string) => {
    const hasCheckedValue = findById(checkedItemValue);

    if (hasCheckedValue) {
      const filteredValues = values.filter(val => val.id !== checkedItemValue);
      const value = filteredValues.length ? filteredValues : null;

      onChange(value);
    } else {
      const value = [...values, findById(checkedItemValue)!];

      onChange(value);
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
              value={!!findById(item.id)}
              textReplacer={textReplacer}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
