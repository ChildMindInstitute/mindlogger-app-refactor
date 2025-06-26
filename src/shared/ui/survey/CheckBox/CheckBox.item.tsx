import { FC, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { XStack } from '@tamagui/stacks';

import { getSelectorColors } from '@app/shared/lib/utils/survey/survey';

import { Item } from './types';
import { CheckBox } from '../../CheckBox';
import { QuestionIcon } from '../../icons/QuestionIcon';
import { Text } from '../../Text';
import { Tooltip } from '../../Tooltip';

type Props = {
  setPalette: boolean;
  imageContainerVisible: boolean;
  tooltipContainerVisible: boolean;
  tooltipAvailable: boolean;
  onChange: () => void;
  value: boolean;
  textReplacer: (markdown: string) => string;
  position: number;
} & Omit<Item, 'value'>;

export const CheckBoxItem: FC<Props> = ({
  value,
  setPalette,
  imageContainerVisible,
  tooltipContainerVisible,
  tooltipAvailable,
  onChange,
  tooltip,
  image,
  color,
  text,
  textReplacer,
  position,
}) => {
  const { textColor, tooltipColor, bgColor, widgetColor, borderColor } =
    getSelectorColors({
      setPalette,
      color,
      selected: value,
    });

  const tooltipText = useMemo(
    () => textReplacer(tooltip || ''),
    [textReplacer, tooltip],
  );

  const name = useMemo(() => textReplacer(text), [textReplacer, text]);

  return (
    <XStack
      minHeight={60}
      bg={bgColor}
      p={16}
      my={8}
      gap={10}
      ai="center"
      jc="space-between"
      br={12}
      borderWidth={2}
      borderColor={borderColor}
      onPress={onChange}
    >
      <CheckBox
        style={Platform.select({
          ios: styles.checkboxIOS,
          android: styles.checkboxAndroid,
        })}
        aria-label="option_checkbox"
        lineWidth={2}
        animationDuration={0.2}
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
        value={value}
        disabled={true}
      />

      {imageContainerVisible && !!image && (
        <XStack style={styles.imageContainer}>
          <CachedImage
            style={styles.image}
            source={image}
            resizeMode="contain"
            aria-label={`checkbox_option_index-${position}`}
          />
        </XStack>
      )}

      <Text aria-label="option_text" color={textColor} fontSize={18} flex={1}>
        {name}
      </Text>

      {tooltipAvailable && tooltipContainerVisible && !!tooltip && (
        <Tooltip
          markdown={tooltipText}
          aria-label={`checkbox-tooltip-view-${tooltipText}`}
        >
          <QuestionIcon color={tooltipColor} />
        </Tooltip>
      )}
    </XStack>
  );
};

const styles = StyleSheet.create({
  checkboxIOS: {
    width: 21,
    height: 21,
  },
  checkboxAndroid: {
    width: 21,
    height: 21,
    left: -6,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
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
