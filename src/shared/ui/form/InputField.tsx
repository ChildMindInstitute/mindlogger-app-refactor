import { FC } from 'react';

import { IInputProps } from 'native-base';
import { Controller, useFormContext, useController } from 'react-hook-form';

import { Text, Input } from '@shared/ui';

type Props = {
  name: string;
  placeholder: string;
  defaultValue?: string;
  size?: string;
  secureTextEntry?: boolean;
} & IInputProps;

const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  size = 'lg',
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
            variant="underlined"
            mb={2}
            size={size}
            ref={ref}
            onBlur={onBlur}
            onChangeText={onFormChange}
            value={value}
            placeholder={placeholder}
            {...props}
            isInvalid={!!error}
          />
        )}
        name={name}
      />

      {error?.message && <Text color="error.500">{error.message}</Text>}
    </>
  );
};

export default InputField;
