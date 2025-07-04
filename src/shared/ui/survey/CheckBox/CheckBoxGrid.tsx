import { CheckBoxCard } from './CheckBoxCard';
import { CheckboxItemProps } from './types';
import { findById } from './utils';
import { Box } from '../../base';
import { SimpleGrid } from '../../SimpleGrid/SimpleGrid';

export function CheckBoxGrid({
  value,
  options,

  addTooltip,
  setPalette,
  hasImage,
  hasTooltip,

  onChange,
  textReplacer,

  ...styledProps
}: CheckboxItemProps) {
  return (
    <Box alignItems="center" {...styledProps}>
      <SimpleGrid
        data={options}
        space={16}
        cellWidth={148}
        renderItem={item => (
          <Box
            aria-label="checkbox-container"
            key={`checkbox-${item.id}`}
            flex={1}
          >
            <CheckBoxCard
              {...item}
              selected={!!findById(value, item.id)}
              tooltipAvailable={addTooltip}
              setPalette={setPalette}
              imageContainerVisible={hasImage}
              tooltipContainerVisible={hasTooltip}
              onPress={() => onChange(item)}
              value={!!findById(value, item.id)}
              textReplacer={textReplacer}
              flex={1}
            />
          </Box>
        )}
      />
    </Box>
  );
}
