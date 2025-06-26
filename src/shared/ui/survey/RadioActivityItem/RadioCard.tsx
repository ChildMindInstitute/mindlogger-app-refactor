import { useMemo } from 'react';
import { AccessibilityProps } from 'react-native';

import { YStackProps } from '@tamagui/stacks';

import { getSelectorColors } from '@app/shared/lib/utils/survey/survey';

import { RadioOption } from './types';
import { Box, RadioGroup } from '../../base';
import { QuestionIcon } from '../../icons/QuestionIcon';
import { OptionCard } from '../../OptionCard';
import { Tooltip } from '../../Tooltip';

type RadioLabelProps = {
  option: RadioOption;
  selected: boolean;
  addTooltip: boolean;
  setPalette: boolean;
  imageContainerVisible: boolean;
  tooltipContainerVisible: boolean;
  textReplacer: (markdown: string) => string;
};

type HandlerProps = {
  onPress: () => void;
};

type Props = RadioLabelProps & AccessibilityProps & HandlerProps & YStackProps;

export function RadioCard({
  selected,
  option: { isHidden, id, text, color, image, tooltip, value },
  addTooltip,
  imageContainerVisible,
  tooltipContainerVisible,
  setPalette,
  accessibilityLabel,
  textReplacer,
  onPress,

  ...styledProps
}: Props) {
  const shouldRenderTooltip =
    addTooltip && tooltipContainerVisible && !!tooltip;

  const name = useMemo(() => textReplacer(text), [textReplacer, text]);
  const tooltipText = useMemo(
    () => textReplacer(tooltip ?? ''),
    [textReplacer, tooltip],
  );

  const { textColor, tooltipColor, bgColor, widgetColor, borderColor } =
    getSelectorColors({
      setPalette,
      color,
      selected,
    });

  if (isHidden) {
    return null;
  }

  return (
    <OptionCard
      bg={bgColor}
      textColor={textColor}
      borderColor={borderColor}
      imageUrl={imageContainerVisible ? image : null}
      onPress={onPress}
      aria-label={accessibilityLabel}
      renderLeftIcon={() => (
        <Box mr={10}>
          <RadioGroup.Item
            aria-label={`radio-option-${value}}`}
            borderColor={widgetColor}
            borderWidth={selected ? 0 : 3}
            bg={selected ? widgetColor : bgColor}
            id={text}
            value={id}
            disabled
          >
            <RadioGroup.Indicator bg={selected ? bgColor : widgetColor} />
          </RadioGroup.Item>
        </Box>
      )}
      renderRightIcon={() =>
        shouldRenderTooltip ? (
          <Box>
            <Tooltip
              hitSlop={20}
              accessibilityLabel={'tooltip_view-' + tooltipText}
              markdown={tooltipText}
            >
              <QuestionIcon color={tooltipColor} />
            </Tooltip>
          </Box>
        ) : null
      }
      {...styledProps}
    >
      {name}
    </OptionCard>
  );
}
