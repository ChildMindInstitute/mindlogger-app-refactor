import { FC } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { colors } from '@shared/lib';
import { Text, Button } from '@shared/ui';

type Color = keyof typeof colors;

type Props = {
  text: string;
  isLoading: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  spinnerColor: Color;
  variant: 'light';
  onClick: () => void;
};

const ProgressButton: FC<Props> = ({
  text,
  buttonStyle,
  onClick,
  isLoading,
  spinnerColor,
  variant,
}) => {
  return (
    <Button
      variant={variant}
      alignSelf="center"
      onPress={onClick}
      style={buttonStyle}
      px={0}
      position="relative">
      {isLoading && (
        <ActivityIndicator
          color={colors[spinnerColor]}
          style={spinnerStyle.spinner}
        />
      )}

      <Text color="$primary" fontSize={20} opacity={isLoading ? 0 : 1}>
        {text}
      </Text>
    </Button>
  );
};

const spinnerStyle = StyleSheet.create({
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

export default ProgressButton;
