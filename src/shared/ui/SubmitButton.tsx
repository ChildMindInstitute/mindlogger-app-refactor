import { PropsWithChildren, FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import { Text, Stack, styled, StackStyleProps, TextProps } from '@tamagui/core';

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
    disabled?: boolean;
    mode?: 'dark' | 'light' | undefined;
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
  ...stylesProps
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}>
      <Button
        style={buttonStyle}
        flexDirection="row"
        justifyContent="center"
        disabled={disabled}
        mode={mode}
        {...stylesProps}>
        <ButtonText mode={mode} {...textProps}>
          {children}
        </ButtonText>
      </Button>
    </TouchableOpacity>
  );
};

export default SubmitButton;
