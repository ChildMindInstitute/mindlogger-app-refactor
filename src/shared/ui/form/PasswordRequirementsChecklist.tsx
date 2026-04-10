import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';

import {
  checkPassword,
  PasswordErrorKey,
} from '@app/shared/lib/utils/passwordValidation';
import { PasswordRequirements } from '@app/shared/ui/form/PasswordRequirements';

type Props = {
  fieldName?: string;
};

export const PasswordRequirementsChecklist = ({
  fieldName = 'password',
}: Props) => {
  const form = useFormContext();
  const passwordValue = String(
    useWatch({ control: form.control, name: fieldName }) ?? '',
  );

  const { generalRequirements, typeRequirements } = useMemo(() => {
    const hasLength = !!passwordValue.length;
    const result = checkPassword(passwordValue);

    return {
      generalRequirements: [
        {
          label: PasswordErrorKey.MIN_LENGTH,
          isValid: hasLength && result.meetsLength,
        },
        {
          label: PasswordErrorKey.NO_BLANK_SPACES,
          isValid: hasLength && result.hasNoSpaces,
        },
      ],
      typeRequirements: [
        {
          label: PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
          isValid: hasLength && result.hasUppercase,
        },
        {
          label: PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
          isValid: hasLength && result.hasLowercase,
        },
        {
          label: PasswordErrorKey.MUST_INCLUDE_DIGITS,
          isValid: hasLength && result.hasDigit,
        },
        {
          label: PasswordErrorKey.MUST_INCLUDE_SYMBOL,
          isValid: hasLength && result.hasSymbol,
        },
      ],
    };
  }, [passwordValue]);

  return (
    <PasswordRequirements
      generalRequirements={generalRequirements}
      typeRequirements={typeRequirements}
    />
  );
};
