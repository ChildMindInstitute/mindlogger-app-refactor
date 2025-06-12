import { useMemo } from 'react';
import { AccessibilityProps } from 'react-native';

import { colors } from '@app/shared/lib/constants/colors';
import { invertColor } from '@app/shared/lib/utils/survey/survey';

import { RadioOption } from './types';
import { Box, RadioGroup } from '../../base';
import { QuestionIcon } from '../../icons/QuestionIcon';
import { OptionCard } from '../../OptionCard';
import { Tooltip } from '../../Tooltip';
import { YStackProps } from '@tamagui/stacks';

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

  const hasColor = color && setPalette;

  const defaultBGColor = selected ? colors.lighterGrey6 : colors.white;
  const bgColor = hasColor ? color : defaultBGColor;

  const textColor = color
    ? invertColor(color, { dark: colors.white, light: colors.black })
    : colors.onSurface;

  const tooltipColor = color
    ? invertColor(color, {
        dark: colors.darkOnSurface,
        light: colors.onSurface,
      })
    : colors.darkerGrey4;

  const invertedRadioColor = color
    ? invertColor(color, {
        dark: colors.darkOnSurface,
        light: colors.onSurface,
      })
    : colors.lighterGrey6;

  const defaultRadioColor = selected ? colors.blue3 : colors.outlineGrey;
  const radioColor = hasColor ? invertedRadioColor : defaultRadioColor;
  const borderColor = selected ? colors.blue3 : colors.lighterGrey7;

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
            accessibilityLabel={`radio-option-${value}}`}
            borderColor={radioColor}
            borderWidth={selected ? 8 : 2}
            bg="transparent"
            id={text}
            value={id}
            disabled
          >
            <RadioGroup.Indicator bg="transparent" />
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
