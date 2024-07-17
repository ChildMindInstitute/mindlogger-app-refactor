import { RadioGroup } from '@tamagui/radio-group';

import RadioCard from './RadioCard';
import { RadioItemProps } from './types';
import { SimpleGrid } from '../../SimpleGrid';

function RadioGrid({
  value,
  options,

  addTooltip,
  setPalette,
  hasImage,
  hasTooltip,

  onChange,
  textReplacer,

  ...styledProps
}: RadioItemProps) {
  return (
    <RadioGroup
      value={value ?? ''}
      onValueChange={onChange}
      name="radio"
      alignItems="center"
      {...styledProps}
    >
      <SimpleGrid
        data={options}
        space={16}
        cellWidth={148}
        renderItem={option => (
          <RadioCard
            key={option.id}
            option={option}
            addTooltip={addTooltip}
            setPalette={setPalette}
            imageContainerVisible={hasImage}
            tooltipContainerVisible={hasTooltip}
            textReplacer={textReplacer}
            onPress={() => onChange(option.id)}
            selected={value === option.id}
            flex={1}
          />
        )}
      />
    </RadioGroup>
  );
}

export default RadioGrid;
