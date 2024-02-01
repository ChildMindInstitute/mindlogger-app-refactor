import React from 'react';
import { View, StyleSheet } from 'react-native';

import { IconProps } from 'react-native-vector-icons/Icon';

export type InputIconProps<T> = Partial<T> & {
  iconProps?: Partial<IconProps>;
  input: React.ReactNode;
  icon: React.ReactNode;
};

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
  },
  input: {
    height: 'auto',
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
});

export function InputIcon<T = any>({ input, icon }: InputIconProps<T>) {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.input}>{input}</View>
      <View style={styles.icon}>{icon}</View>
    </View>
  );
}
