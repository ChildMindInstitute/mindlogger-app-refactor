import { FC, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@shared/lib';
import { invertColor, handleReplaceBehaviourResponse } from '@shared/lib/utils';
import {
  Image,
  Text,
  XStack,
  QuestionTooltipIcon,
  Tooltip,
  CheckBox,
} from '@shared/ui';

import { Item } from './types';

type CheckBoxItemProps = {
  colorPalette: boolean;
  onChange: (itemValue: number) => void;
  checked: boolean;
} & Item;

const CheckBoxItem: FC<CheckBoxItemProps> = ({
  colorPalette,
  onChange,
  checked,
  description,
  image,
  color,
  value,
  name,
}) => {
  const invertedColor =
    colorPalette && color ? invertColor(color) : colors.primary;

  const tooltipText = useMemo(
    () => handleReplaceBehaviourResponse(description),
    [description],
  );
  return (
    <XStack
      ai="center"
      onPress={() => onChange(value)}
      jc="space-between"
      py="$3"
      px="$5"
      my="$1"
      br={7}
      bg={colorPalette ? color : 'none'}
      minHeight="$7"
      bbw={colorPalette ? 0 : 1}
      bbc={colors.lighterGrey}
    >
      <XStack flex={1} ai="center">
        {description && (
          <Tooltip tooltipText={tooltipText}>
            <QuestionTooltipIcon color={colors.grey} size={25} />
          </Tooltip>
        )}

        {image ? (
          <Image
            ml={description ? 5 : 0}
            src={image}
            resizeMode="contain"
            width="15%"
            height={64}
          />
        ) : null}

        <Text
          ml="$4"
          maxWidth="70%"
          color={colorPalette && color ? invertedColor : colors.darkerGrey}
          fontSize={17}
        >
          {useMemo(() => handleReplaceBehaviourResponse(name.en), [name.en])}
        </Text>
      </XStack>

      <CheckBox
        style={styles.checkbox}
        tintColors={{
          true: colors.grey,
          false: colors.grey,
        }}
        onCheckColor={color || colors.white}
        onFillColor={invertedColor}
        onTintColor={invertedColor}
        tintColor={invertedColor}
        boxType="square"
        lineWidth={2}
        onAnimationType="fade"
        offAnimationType="fade"
        animationDuration={0.2}
        value={checked}
        disabled={true}
      />
    </XStack>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
  },
});

export default CheckBoxItem;
