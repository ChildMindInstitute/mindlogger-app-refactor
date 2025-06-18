import { PropsWithChildren } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ColorValue,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ActivityIndicator } from './ActivityIndicator';
import { BoxProps } from './base';
import { Center } from './Center';
import { Text } from './Text';
import { palette } from '../lib/constants/palette';

type Props = PropsWithChildren<{
  onPress: () => void;
  isLoading?: boolean;
  spinnerColor?: ColorValue;
  textStyles?: {
    textColor?: ColorValue;
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900';
    fontSize?: number;
  };
  touchableStyles?: StyleProp<ViewStyle>;
}> &
  BoxProps;

export function Button({
  onPress,
  isLoading,
  spinnerColor,
  textStyles = {
    textColor: '$white',
    fontWeight: '700',
    fontSize: 17,
  },
  touchableStyles,
  children,
  ...styledProps
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchable, touchableStyles]}
      disabled={isLoading}
    >
      <Center
        py={8}
        bg={palette.blue2}
        borderRadius="$10"
        w="100%"
        {...styledProps}
      >
        <Text
          color={textStyles.textColor}
          fontWeight={textStyles.fontWeight}
          fontSize={textStyles.fontSize}
          opacity={isLoading ? 0 : 1}
        >
          {children}
        </Text>

        {isLoading && (
          <ActivityIndicator
            position="absolute"
            t={0}
            b={0}
            l={0}
            r={0}
            color={spinnerColor}
          />
        )}
      </Center>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});
