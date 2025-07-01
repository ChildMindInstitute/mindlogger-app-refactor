import { PropsWithChildren, FC } from 'react';
import { AccessibilityProps, StyleSheet, TouchableOpacity } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import { Stack, styled, StackStyle, TextProps } from '@tamagui/core';

import { Box } from './base';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { IS_ANDROID } from '../lib/constants';
import { palette } from '../lib/constants/palette';

const ButtonText = styled(Text, {
  fontSize: 16,
  lineHeight: 20,
  letterSpacing: 0.15,
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
      tonal: {
        color: '$on_secondary_container',
        fontWeight: '400',
      },
    },
  } as const,
});

const Button = styled(Stack, {
  borderRadius: 100,
  px: 24,
  minHeight: 48,
  alignItems: 'center',
  justifyContent: 'center',
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
      tonal: {
        backgroundColor: '$secondary_container',
      },
    },
  },
});

type Props = PropsWithChildren<
  {
    onPress?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    mode?: 'primary' | 'secondary' | 'tonal';
    buttonStyle?: StyleProp<ViewStyle>;
    rightIcon?: React.ReactNode;
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
  rightIcon,
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

        {!!rightIcon && (
          <Box ml={8} mt={IS_ANDROID ? -2 : -1} opacity={isLoading ? 0 : 1}>
            {rightIcon}
          </Box>
        )}

        {isLoading && (
          <Box style={StyleSheet.absoluteFill} ai="center" jc="center">
            <Spinner
              size={28}
              color={
                mode === 'primary' ? palette.on_primary : palette.on_surface
              }
            />
          </Box>
        )}
      </Button>
    </TouchableOpacity>
  );
};
