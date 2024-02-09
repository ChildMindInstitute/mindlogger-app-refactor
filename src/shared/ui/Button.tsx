import { PropsWithChildren } from 'react';
import { TouchableOpacity, StyleSheet, ColorValue } from 'react-native';

import { colors } from '../lib';

import { ActivityIndicator, BoxProps, Center, Text } from '.';

type Props = PropsWithChildren<{
  onPress: () => void;
  isLoading?: boolean;
  spinnerColor?: ColorValue;
}> &
  BoxProps;

function Button({ onPress, isLoading, spinnerColor, children, ...styledProps }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable} disabled={isLoading}>
      <Center py={8} bg={colors.blue2} borderRadius="$10" w="100%" {...styledProps}>
        <Text color="$white" fontWeight="bold" fontSize={17} opacity={isLoading ? 0 : 1}>
          {children}
        </Text>

        {isLoading && <ActivityIndicator position="absolute" t={0} b={0} l={0} r={0} color={spinnerColor} />}
      </Center>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});

export default Button;
