import { useMemo } from 'react';
import { AccessibilityProps } from 'react-native';

import { YStackProps } from '@tamagui/stacks';

import { palette } from '@app/shared/lib/constants/palette';
import { invertColor } from '@app/shared/lib/utils/survey/survey';

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

  const hasColor = color && setPalette;

  const defaultBGColor = selected ? palette.lighterGrey6 : palette.white;
  const bgColor = hasColor ? color : defaultBGColor;

  const textColor = color
    ? invertColor(color, { dark: palette.white, light: palette.black })
    : palette.on_surface;

  const tooltipColor = color
    ? invertColor(color, {
        dark: palette.darkon_surface,
        light: palette.on_surface,
      })
    : palette.darkerGrey4;

  const invertedRadioColor = color
    ? invertColor(color, {
        dark: palette.darkon_surface,
        light: palette.on_surface,
      })
    : palette.lighterGrey6;

  const defaultRadioColor = selected ? palette.blue3 : palette.outlineGrey;
  const radioColor = hasColor ? invertedRadioColor : defaultRadioColor;
  const borderColor = selected ? palette.blue3 : palette.lighterGrey7;

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
