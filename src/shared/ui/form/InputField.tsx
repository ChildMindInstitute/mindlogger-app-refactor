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
  filterInput?: (text: string) => string;
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
  filterInput,
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

  const handleChangeText = (text: string) => {
    const filteredText = filterInput ? filterInput(text) : text;
    onFormChange(filteredText);
    props.onChangeText?.(filteredText);
  };

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
                onChangeText={handleChangeText}
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
          mt={4}
          error={error}
          accessibilityLabel={`${name}-error-text`}
        />
      )}
    </>
  );
};
