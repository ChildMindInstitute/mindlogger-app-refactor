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
} & TextInputProps;

const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  placeholder,
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
            isInvalid={!!error}
            autoCapitalize="none"
            {...props}
          />
        )}
        name={name}
      />

      <ErrorMessage mt={8} error={error} />
    </>
  );
};

export default InputField;
