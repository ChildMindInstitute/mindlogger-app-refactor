import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { PasswordRequirements } from '@app/shared/ui/form';

export const SignUpPasswordRequirements = () => {
  const { formState, getValues } = useFormContext();
  const passwordHasLength = !!getValues().password.length;
  const passwordRequirements = useMemo(() => {
    const errors = Object.values(
      formState.errors?.password?.types || {},
    ).flat();

    return [
      'password_requirements:at_least_characters',
      'password_requirements:no_blank_spaces',
    ].map(key => ({
      label: key,
      isValid: passwordHasLength && !errors.includes(key),
    }));
  }, [passwordHasLength, formState.errors?.password?.types]);

  return <PasswordRequirements requirements={passwordRequirements} />;
};

export default SignUpPasswordRequirements;
