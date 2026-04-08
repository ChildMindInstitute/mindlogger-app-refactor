import { useMemo } from 'react';

import { useFormContext } from 'react-hook-form';

import { useFormChanges } from '@app/shared/lib/hooks/useFormChanges';
import { PasswordRequirements } from '@app/shared/ui/form/PasswordRequirements';
import { PasswordErrorKey } from '@app/shared/lib/utils/passwordValidation';

export const PasswordRequirementsChecklist = () => {
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
      PasswordErrorKey.MIN_LENGTH,
      PasswordErrorKey.NO_BLANK_SPACES,
      PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
      PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
      PasswordErrorKey.MUST_INCLUDE_DIGITS,
      PasswordErrorKey.MUST_INCLUDE_SYMBOL,
    ].map(key => ({
      label: key,
      isValid: passwordHasLength && !errors.includes(key),
    }));
  }, [passwordHasLength, form.formState.errors?.password?.types]);

  return <PasswordRequirements requirements={passwordRequirements} />;
};
