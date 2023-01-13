import { FC } from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

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
      px={0}>
      {isLoading ? (
        <ActivityIndicator color={colors[spinnerColor]} />
      ) : (
        <Text color="$primary" fontSize={20}>
          {text}
        </Text>
      )}
    </Button>
  );
};

export default ProgressButton;
