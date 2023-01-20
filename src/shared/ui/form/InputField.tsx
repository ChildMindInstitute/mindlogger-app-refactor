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
  mode?: 'dark' | 'light';
} & TextInputProps;

const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  placeholder,
  mode = 'light',
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
            mode={mode}
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
