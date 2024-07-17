import { RadioGroup } from '@tamagui/radio-group';
import { YStack } from '@tamagui/stacks';

import { colors } from '@app/shared/lib';

import RadioItem from './RadioItem';
import { RadioItemProps } from './types';
import { Box } from '../..';

function RadioList({
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
          <Box
            key={option.id}
            bbc={colors.lighterGrey}
            bbw={setPalette ? 0 : 1}
            onPress={() => onChange(option.id)}
          >
            <RadioItem
              accessibilityLabel="radio-item-option"
              option={option}
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

export default RadioList;
