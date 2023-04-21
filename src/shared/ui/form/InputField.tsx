import { FC } from 'react';
import { ColorValue, TextInputProps } from 'react-native';

import { Controller, useFormContext, useController } from 'react-hook-form';

import { Input } from '@shared/ui';
import { ErrorMessage } from '@shared/ui/form';

type Props = {
  name: string;
  placeholder: string;
  defaultValue?: string;
  size?: string;
  secureTextEntry?: boolean;
  backgroundColor?: ColorValue | undefined;
  mode?: 'dark' | 'light';
} & TextInputProps;

const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  placeholder,
  mode = 'light',
  backgroundColor,
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
          <Input
            ref={ref}
            onBlur={onBlur}
            onChangeText={onFormChange}
            value={value}
            placeholder={placeholder}
            autoCapitalize="none"
            mode={mode}
            backgroundColor={backgroundColor}
            {...props}
            isInvalid={!!error}
          />
        )}
        name={name}
      />

      <ErrorMessage mode={mode} mt={8} error={error} />
    </>
  );
};

export default InputField;
