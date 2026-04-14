import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import {
  checkPassword,
  isAccountPasswordPolicySatisfied,
  PasswordErrorKey,
} from '@app/shared/lib/utils/passwordValidation';
import { PasswordRequirements } from '@app/shared/ui/form/PasswordRequirements';

type Props = {
  fieldName?: string;
  /** While true, checklist stays visible; also shown when password is non-empty and still invalid. */
  isPasswordFocused: boolean;
};

export const PasswordRequirementsChecklist = ({
  fieldName = 'password',
  isPasswordFocused,
}: Props) => {
  const form = useFormContext();
  const passwordValue = String(
    useWatch({ control: form.control, name: fieldName }) ?? '',
  );

  const { show, generalRequirements, typeRequirements } = useMemo(() => {
    const result = checkPassword(passwordValue);
    const showPanel =
      isPasswordFocused ||
      (passwordValue.length > 0 &&
        !isAccountPasswordPolicySatisfied(passwordValue));

    return {
      show: showPanel,
      generalRequirements: [
        {
          label: PasswordErrorKey.MIN_LENGTH,
          isValid: result.meetsLength,
        },
        {
          label: PasswordErrorKey.NO_BLANK_SPACES,
          isValid: result.hasNoSpaces,
        },
      ],
      typeRequirements: [
        {
          label: PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
          isValid: result.meetsCharTypeRequirement || result.hasUppercase,
        },
        {
          label: PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
          isValid: result.meetsCharTypeRequirement || result.hasLowercase,
        },
        {
          label: PasswordErrorKey.MUST_INCLUDE_DIGITS,
          isValid: result.meetsCharTypeRequirement || result.hasDigit,
        },
        {
          label: PasswordErrorKey.MUST_INCLUDE_SYMBOL,
          isValid: result.meetsCharTypeRequirement || result.hasSymbol,
        },
      ],
    };
  }, [passwordValue, isPasswordFocused]);

  if (!show) {
    return null;
  }

  return (
    <PasswordRequirements
      generalRequirements={generalRequirements}
      typeRequirements={typeRequirements}
    />
  );
};
