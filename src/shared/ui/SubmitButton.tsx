import { PropsWithChildren, FC } from 'react';
import { AccessibilityProps, StyleSheet, TouchableOpacity } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import { Stack, styled, StackStyle, TextProps } from '@tamagui/core';

import { ActivityIndicator } from './ActivityIndicator';
import { Text } from './Text';

const ButtonText = styled(Text, {
  fontSize: 16,
  lineHeight: 20,
  // I'm not sure why this is throwing a type error, but it works fine, so I'm suppressing it for now.
  // This is a consequence of the react-native upgrade to version 0.79.2
  // @ts-expect-error TS2322
  variants: {
    mode: {
      primary: {
        color: '$on_primary',
        fontWeight: '700',
      },
      secondary: {
        color: '$on_secondary',
        fontWeight: '400',
      },
    },
  } as const,
});

const Button = styled(Stack, {
  borderRadius: 100,
  px: 24,
  py: 14,
  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
    mode: {
      primary: {
        backgroundColor: '$primary',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: '$outline_variant',
        borderWidth: 1,
      },
    },
  },
});

type Props = PropsWithChildren<
  {
    onPress?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    mode?: 'primary' | 'secondary';
    buttonStyle?: StyleProp<ViewStyle>;
  } & {
    textProps?: TextProps;
  } & StackStyle
>;

export const SubmitButton: FC<Props & AccessibilityProps> = ({
  children,
  onPress,
  disabled,
  mode = 'primary',
  textProps,
  buttonStyle,
  isLoading = false,
  accessibilityLabel,
  ...stylesProps
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      disabled={disabled || isLoading}
      accessibilityLabel={accessibilityLabel}
      testID="submit-button"
    >
      <Button
        style={buttonStyle}
        flexDirection="row"
        justifyContent="center"
        disabled={disabled}
        mode={mode}
        {...stylesProps}
      >
        {/* I'm not sure why this is throwing a type error, but it works fine, so I'm suppressing it for now. */}
        {/* This is a consequence of the react-native upgrade to version 0.79.2 */}
        {/* @ts-expect-error TS2322 */}
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
