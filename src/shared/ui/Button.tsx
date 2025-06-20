import { PropsWithChildren } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { Box, BoxProps, TextProps } from './base';
import { Center } from './Center';
import { Spinner } from './Spinner';
import { Text } from './Text';

type Props = PropsWithChildren<{
  onPress: () => void;
  isLoading?: boolean;
  spinnerColor?: string;
  textProps?: TextProps;
  touchableStyles?: StyleProp<ViewStyle>;
}> &
  BoxProps;

export function Button({
  onPress,
  isLoading,
  spinnerColor = '$on_primary',
  textProps = {
    color: '$on_primary',
    fontWeight: '700',
    textAlign: 'center',
  },
  touchableStyles,
  children,
  ...styledProps
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={touchableStyles}
      disabled={isLoading}
    >
      <Center
        px={24}
        py={12}
        bg="$primary"
        borderRadius={100}
        w="100%"
        {...styledProps}
      >
        <Text {...textProps} opacity={isLoading ? 0 : 1}>
          {children}
        </Text>

        {isLoading && (
          <Box style={StyleSheet.absoluteFill} ai="center" jc="center">
            <Spinner size={28} color={spinnerColor} />
          </Box>
        )}
      </Center>
    </TouchableOpacity>
  );
}
