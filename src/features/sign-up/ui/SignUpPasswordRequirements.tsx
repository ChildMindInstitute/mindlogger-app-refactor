import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { useFormChanges } from '@app/shared/lib';
import { PasswordRequirements } from '@app/shared/ui/form';

export const SignUpPasswordRequirements = () => {
  const form = useFormContext();

  useFormChanges({
    form,
    watchInputs: ['password'],
    onInputChange: () => form.trigger('password'),
  });

  const passwordHasLength = !!form.getValues().password.length;
  const passwordRequirements = useMemo(() => {
    const errors = Object.values(
      form.formState.errors?.password?.types || {},
    ).flat();

    return [
      'password_requirements:at_least_characters',
      'password_requirements:no_blank_spaces',
    ].map(key => ({
      label: key,
      isValid: passwordHasLength && !errors.includes(key),
    }));
  }, [passwordHasLength, form.formState.errors?.password?.types]);

  return <PasswordRequirements requirements={passwordRequirements} />;
};

export default SignUpPasswordRequirements;
