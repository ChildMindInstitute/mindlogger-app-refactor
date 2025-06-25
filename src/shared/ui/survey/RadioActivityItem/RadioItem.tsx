import { FC, useMemo } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';

import { getSelectorColors } from '@app/shared/lib/utils/survey/survey';

import { RadioOption } from './types';
import { Box, RadioGroup, XStack } from '../../base';
import { QuestionIcon } from '../../icons/QuestionIcon';
import { Text } from '../../Text';
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

export const RadioItem: FC<RadioLabelProps & AccessibilityProps> = ({
  option: { isHidden, id, text, color, image, tooltip, value },
  selected,
  addTooltip,
  imageContainerVisible,
  tooltipContainerVisible,
  setPalette,
  textReplacer,
  accessibilityLabel,
}) => {
  const name = useMemo(() => textReplacer(text), [textReplacer, text]);
  const tooltipText = useMemo(
    () => textReplacer(tooltip ?? ''),
    [textReplacer, tooltip],
  );

  if (isHidden) {
    return null;
  }

  const { textColor, tooltipColor, bgColor, widgetColor, borderColor } =
    getSelectorColors({
      setPalette,
      color,
      selected,
    });

  return (
    <XStack
      minHeight={60}
      bg={bgColor}
      p={16}
      my={8}
      gap={10}
      jc="space-between"
      ai="center"
      borderRadius={12}
      borderWidth={2}
      borderColor={borderColor}
      aria-label={accessibilityLabel}
    >
      <RadioGroup.Item
        aria-label={`radio-option-${value}`}
        borderColor={widgetColor}
        borderWidth={selected ? 0 : 3}
        bg={selected ? widgetColor : bgColor}
        id={text}
        value={id}
      >
        <RadioGroup.Indicator bg={selected ? bgColor : widgetColor} />
      </RadioGroup.Item>

      {imageContainerVisible && !!image && (
        <Box style={styles.imageContainer}>
          <CachedImage
            resizeMode="contain"
            aria-label={`radio-option-image-${value}`}
            style={styles.image}
            source={image}
          />
        </Box>
      )}

      <Text
        aria-label={'radio-option-text'}
        fontSize={18}
        color={textColor}
        flex={1}
      >
        {name}
      </Text>

      {addTooltip && tooltipContainerVisible && !!tooltip && (
        <Tooltip
          aria-label={'tooltip_view-' + tooltipText}
          markdown={tooltipText}
        >
          <QuestionIcon color={tooltipColor} />
        </Tooltip>
      )}
    </XStack>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 56,
    height: 56,
    overflow: 'hidden',
    borderRadius: 4,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
