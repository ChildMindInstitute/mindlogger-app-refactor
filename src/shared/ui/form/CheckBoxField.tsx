import { FC, PropsWithChildren } from 'react';

import { ICheckboxProps } from 'native-base';
import { Controller, useFormContext, useController } from 'react-hook-form';

import { Text, Checkbox } from '@shared/ui';

type Props = {
  name: string;
  size?: string;
} & ICheckboxProps;

const CheckBoxField: FC<PropsWithChildren<Props>> = ({
  name,
  size = 'sm',
  children,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field: { onChange: onFormChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <>
      <Controller
        control={control}
        render={() => (
          <Checkbox
            onChange={onFormChange}
            my={2}
            size={size}
            isInvalid={!!error}
            {...props}>
            {children}
          </Checkbox>
        )}
        name={name}
      />

      {error?.message && <Text color="error.500">{error.message}</Text>}
    </>
  );
};

export default CheckBoxField;
