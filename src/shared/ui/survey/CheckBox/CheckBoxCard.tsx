import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { YStackProps } from '@tamagui/stacks';

import { IS_ANDROID } from '@app/shared/lib/constants';
import { getSelectorColors } from '@app/shared/lib/utils/survey/survey';

import { Item } from './types';
import { Box } from '../../base';
import { CheckBox } from '../../CheckBox';
import { QuestionIcon } from '../../icons/QuestionIcon';
import { OptionCard } from '../../OptionCard';
import { Tooltip } from '../../Tooltip';

type CheckBoxProps = {
  setPalette: boolean;
  imageContainerVisible: boolean;
  tooltipContainerVisible: boolean;
  tooltipAvailable: boolean;
  onPress: () => void;
  value: boolean;
  selected: boolean;
  textReplacer: (markdown: string) => string;
} & Omit<Item, 'value'>;

type Props = CheckBoxProps & Omit<YStackProps, keyof CheckBoxProps>;

export function CheckBoxCard({
  selected,

  imageContainerVisible,
  image,
  text,

  tooltip,
  tooltipContainerVisible,
  setPalette,
  color,

  accessibilityLabel,

  onPress,
  textReplacer,

  ...styledProps
}: Props) {
  const shouldRenderTooltip = tooltipContainerVisible && !!tooltip;

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

  return (
    <OptionCard
      bg={bgColor}
      textColor={textColor}
      borderColor={borderColor}
      imageUrl={imageContainerVisible ? image : null}
      onPress={onPress}
      aria-label={accessibilityLabel}
      renderLeftIcon={() => (
        <Box mr={12} w={20} h={20}>
          <CheckBox
            style={Platform.select({
              ios: styles.checkboxIOS,
              android: styles.checkboxAndroid,
            })}
            accessibilityLabel="option_checkbox"
            lineWidth={IS_ANDROID ? 0 : 2}
            boxType="square"
            tintColors={{
              true: widgetColor,
              false: widgetColor,
            }}
            onCheckColor={bgColor}
            onFillColor={widgetColor}
            onTintColor={widgetColor}
            tintColor={widgetColor}
            onAnimationType="fade"
            offAnimationType="fade"
            value={selected}
            disabled
          />
        </Box>
      )}
      renderRightIcon={() =>
        shouldRenderTooltip ? (
          <Box>
            <Tooltip
              hitSlop={20}
              accessibilityLabel={`checkbox-tooltip-view-${tooltipText}`}
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

const styles = StyleSheet.create({
  checkboxIOS: {
    width: 21,
    height: 21,
    position: 'absolute',
    right: 0,
  },
  checkboxAndroid: {
    width: 21,
    height: 21,
    position: 'absolute',
    right: 5,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
