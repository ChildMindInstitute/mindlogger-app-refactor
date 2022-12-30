import { FC } from 'react';
import { Controller, useFormContext, useController } from 'react-hook-form';
import { Text, Input, Center } from '@shared/ui';

type Props = {
  name: string;
  placeholder: string;
  defaultValue?: string;
  size?: string;
  variant?: string;
};

const InputField: FC<Props> = ({
  name,
  defaultValue = '',
  size = 'lg',
  variant = 'underlined',
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
      <Center>
        <Controller
          control={control}
          render={() => (
            <Input
              variant={variant}
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
          name="firstName"
        />
      </Center>
      {error?.message && <Text color="error.500">{error.message}</Text>}
    </>
  );
};

export default InputField;
