import { FC } from 'react';
import { ColorValue } from 'react-native';

import { Controller, useFormContext, useController } from 'react-hook-form';

import { ErrorMessage } from './ErrorMessage';
import { Box, XStack } from '../base';
import { Input, InputProps } from '../Input';

type Props = {
  name: string;
  placeholder: string;
  defaultValue?: string;
  size?: string;
  secureTextEntry?: boolean;
  backgroundColor?: ColorValue | undefined;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hideError?: boolean;
} & InputProps;

export const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  placeholder,
  mode = 'light',
  backgroundColor,
  leftIcon,
  rightIcon,
  hideError,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange: onFormChange, value, ref, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <>
      <Controller
        control={control}
        render={() => (
          <>
            <XStack alignItems="center">
              {leftIcon && (
                <Box px={10} position="absolute" left={0}>
                  {leftIcon}
                </Box>
              )}

              <Input
                flex={1}
                ref={ref}
                onBlur={e => {
                  onBlur();
                  props.onBlur && props.onBlur(e);
                }}
                onChangeText={onFormChange}
                value={value}
                placeholder={placeholder}
                autoCapitalize="none"
                mode={mode}
                backgroundColor={backgroundColor}
                {...props}
                isInvalid={!!error}
                pl={leftIcon ? 40 : undefined}
                pr={rightIcon ? 40 : undefined}
                fontFamily="$body"
              />

              {rightIcon && (
                <Box px={10} position="absolute" right={0}>
                  {rightIcon}
                </Box>
              )}
            </XStack>
          </>
        )}
        name={name}
      />

      {!hideError && (
        <ErrorMessage
          mode={mode === 'dark' ? 'dark' : 'light'}
          mt={8}
          error={error}
          accessibilityLabel={`${name}-error-text`}
        />
      )}
    </>
  );
};
