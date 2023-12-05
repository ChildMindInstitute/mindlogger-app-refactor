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

const findById = (items: Item[], id: string): Item | undefined => {
  return items.find(val => val.id === id);
};

const CheckBoxActivityItem: FC<Props> = ({
  config,
  onChange,
  values,
  textReplacer,
}) => {
  const { options, randomizeOptions, addTooltip, setPalette } = config;

  const hasImage = useMemo(
    () => Boolean(options.find(option => !!option.image)),
    [options],
  );

  const onItemValueChanged = (checkedItemValue: string) => {
    const checkedValue = findById(values, checkedItemValue);

    if (checkedValue != null) {
      const filteredValues = values.filter(val => val.id !== checkedItemValue);
      const value = filteredValues.length ? filteredValues : null;

      onChange(value);
    } else {
      const value = [...values, findById(config.options, checkedItemValue)!];

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
          <Box
            accessibilityLabel="checkbox-container"
            key={`checkbox-${item.id}`}
          >
            <CheckBoxItem
              {...item}
              tooltipAvailable={addTooltip}
              setPalette={setPalette}
              setEmptyImage={hasImage}
              onChange={() => onItemValueChanged(item.id)}
              value={!!findById(values, item.id)}
              textReplacer={textReplacer}
            />
          </Box>
        );
      })}
    </ScrollView>
  );
};

export default CheckBoxActivityItem;
