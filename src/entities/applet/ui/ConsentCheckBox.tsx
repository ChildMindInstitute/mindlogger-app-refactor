import { StyleSheet } from 'react-native';

import { CheckBox, XStack, BoxProps } from '@app/shared/ui';

type Props = {
  value: boolean;
  label: JSX.Element;
  onChange: (value: boolean) => void;
} & BoxProps;

function ConsentCheckBox({ value, label, onChange, ...boxProps }: Props) {
  const changeValue = () => onChange(!value);

  return (
    <XStack {...boxProps} onPress={changeValue} hitSlop={4}>
      <CheckBox
        lineWidth={2}
        animationDuration={0.1}
        boxType="square"
        onCheckColor="black"
        onTintColor="black"
        tintColor="black"
        style={styles.checkbox}
        disabled
        onAnimationType="fade"
        offAnimationType="fade"
        value={value}
      />

      {label}
    </XStack>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
  },
});

export default ConsentCheckBox;
