import { RadioGroup } from '@tamagui/radio-group';
import { YStack } from '@tamagui/stacks';

import { RadioItem } from './RadioItem';
import { RadioItemProps } from './types';
import { Box } from '../../base';

export function RadioList({
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
    <YStack>
      <RadioGroup
        value={value ?? ''}
        onValueChange={onChange}
        name="radio"
        {...styledProps}
      >
        {options.map(option => (
          <Box key={option.id} onPress={() => onChange(option.id)}>
            <RadioItem
              aria-label="radio-item-option"
              option={option}
              selected={value === option.id}
              imageContainerVisible={hasImage}
              tooltipContainerVisible={hasTooltip}
              addTooltip={addTooltip}
              setPalette={setPalette}
              textReplacer={textReplacer}
            />
          </Box>
        ))}
      </RadioGroup>
    </YStack>
  );
}
