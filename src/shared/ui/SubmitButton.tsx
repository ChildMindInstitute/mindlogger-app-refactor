import { PropsWithChildren, FC } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import { Text, Stack, styled, StackStyleProps, TextProps } from '@tamagui/core';

import ActivityIndicator from './ActivityIndicator';

const ButtonText = styled(Text, {
  fontSize: 20,
  variants: {
    mode: {
      light: {
        color: '$primary',
      },
      dark: {
        color: '$white',
      },
    },
  },
});

const Button = styled(Stack, {
  borderRadius: 4,
  px: 50,
  py: 10,
  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
    mode: {
      light: {
        backgroundColor: '$secondary',
      },
      dark: {
        backgroundColor: '$primary',
      },
    },
  },
});

type Props = PropsWithChildren<
  {
    onPress?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    mode?: 'dark' | 'light';
    buttonStyle?: StyleProp<ViewStyle>;
  } & {
    textProps?: TextProps;
  } & StackStyleProps
>;

const SubmitButton: FC<Props> = ({
  children,
  onPress,
  disabled,
  textProps,
  mode = 'light',
  buttonStyle,
  isLoading = false,
  ...stylesProps
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      disabled={disabled || isLoading}
    >
      <Button
        style={buttonStyle}
        flexDirection="row"
        justifyContent="center"
        disabled={disabled}
        mode={mode}
        {...stylesProps}
      >
        <ButtonText mode={mode} {...textProps} opacity={isLoading ? 0 : 1}>
          {children}
        </ButtonText>

        {isLoading && <ActivityIndicator style={spinnerStyle.spinner} />}
      </Button>
    </TouchableOpacity>
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

export default SubmitButton;
