import { FC, useState } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '@shared/lib';
import {
  Image,
  Text,
  XStack,
  QuestionTooltipIcon,
  Tooltip,
  CheckBox,
} from '@shared/ui';

import { Item } from './types';
import { invertColor } from './utils';

const handleReplaceBehaviourResponse = (string: string) => string;

type CheckBoxItemProps = {
  item: Item;
  colorPalette: boolean;
  onChange: (itemValue: number) => void;
  isSingleItem: boolean;
  initialValue: boolean;
};

const CheckBoxItem: FC<CheckBoxItemProps> = ({
  item,
  colorPalette,
  onChange,
  isSingleItem,
  initialValue,
}) => {
  const { description, image } = item;
  const [checked, setChecked] = useState<boolean>(initialValue);

  const invertedColor =
    colorPalette && item.color ? invertColor(item.color) : colors.primary;

  const onPress = () => {
    onChange(item.value);
    if (isSingleItem) {
      setChecked(true);
    } else {
      setChecked(!checked);
    }
  };

  return (
    <XStack
      ai="center"
      onPress={onPress}
      jc="space-between"
      py="$3"
      px="$5"
      my="$1"
      br={7}
      bg={colorPalette ? item.color : 'none'}
      minHeight="$7"
      bbw={colorPalette ? 0 : 1}
      bbc={colors.lighterGrey}
    >
      <XStack flex={1} ai="center">
        {description && (
          <Tooltip tooltipText={handleReplaceBehaviourResponse(description)}>
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
          color={colorPalette && item.color ? invertedColor : colors.darkerGrey}
          fontSize={17}
        >
          {handleReplaceBehaviourResponse(item.name.en)}
        </Text>
      </XStack>

      <CheckBox
        style={styles.checkbox}
        tintColors={{
          true: colors.grey,
          false: colors.grey,
        }}
        onCheckColor={item.color || colors.white}
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
