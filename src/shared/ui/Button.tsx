import { PropsWithChildren } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { colors } from '../lib';

import { BoxProps, Center, Text } from '.';

type Props = PropsWithChildren<{
  onPress: () => void;
}> &
  BoxProps;

function Button({ onPress, children, ...styledProps }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <Center
        py={8}
        bg={colors.blue2}
        borderRadius="$10"
        w="100%"
        {...styledProps}
      >
        <Text color="$white" fontWeight="bold" fontSize={20}>
          {children}
        </Text>
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
