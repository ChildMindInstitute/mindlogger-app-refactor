import { FC } from 'react';
import { TextInputProps } from 'react-native';

import { Controller, useFormContext, useController } from 'react-hook-form';

import { Input } from '@shared/ui';
import { ErrorMessage } from '@shared/ui/form';

type Props = {
  name: string;
  placeholder: string;
  defaultValue?: string;
  size?: string;
  secureTextEntry?: boolean;
  variant?: 'light' | 'dark' | undefined;
} & TextInputProps;

const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  placeholder,
  variant = 'light',
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
            {...props}
            variant={variant}
            isInvalid={!!error}
          />
        )}
        name={name}
      />

      <ErrorMessage variant={variant} mt={8} error={error} />
    </>
  );
};

export default InputField;
