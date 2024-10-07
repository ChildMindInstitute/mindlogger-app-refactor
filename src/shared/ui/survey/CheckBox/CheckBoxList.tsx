import { CheckBoxItem } from './CheckBox.item';
import { CheckboxItemProps } from './types';
import { findById } from './utils';
import { Box } from '../../base';

export function CheckBoxList({
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
    <Box {...styledProps}>
      {options.map((item, index) => {
        return (
          <Box
            accessibilityLabel="checkbox-container"
            key={`checkbox-${item.id}`}
          >
            <CheckBoxItem
              {...item}
              tooltipAvailable={addTooltip}
              setPalette={setPalette}
              imageContainerVisible={hasImage}
              tooltipContainerVisible={hasTooltip}
              onChange={() => onChange(item)}
              value={!!findById(value, item.id)}
              textReplacer={textReplacer}
              position={index}
            />
          </Box>
        );
      })}
    </Box>
  );
}
