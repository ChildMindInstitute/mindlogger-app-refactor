import { useEffect, useMemo, useRef, useState } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';
import { DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS } from '@app/shared/lib/constants/password';
import {
  checkPassword,
  isAccountPasswordPolicySatisfied,
  PasswordErrorKey,
} from '@app/shared/lib/utils/passwordValidation';
import { PasswordRequirements } from '@app/shared/ui/form/PasswordRequirements';

import { YStack } from '../base';
import { Text } from '../Text';

type Props = {
  fieldName?: string;
  /** While true, checklist stays visible; also shown when password is non-empty and still invalid. */
  isPasswordFocused: boolean;
  isFirstTimeFocused: boolean;
};

export const PasswordRequirementsChecklist = ({
  fieldName = 'password',
  isPasswordFocused,
  isFirstTimeFocused,
}: Props) => {
  const { t } = useTranslation();
  const form = useFormContext();
  const passwordValue = String(
    useWatch({ control: form.control, name: fieldName }) ?? '',
  );

  const [debouncedPassword, setDebouncedPassword] = useState(passwordValue);
  const passwordRef = useRef(passwordValue);

  passwordRef.current = passwordValue;

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedPassword(passwordRef.current);
    }, DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [passwordValue, isFirstTimeFocused]);

  const { show, generalRequirements, typeRequirements } = useMemo(() => {
    const result = checkPassword(debouncedPassword);
    const showPanel =
      isPasswordFocused ||
      (debouncedPassword.length > 0 &&
        !isAccountPasswordPolicySatisfied(debouncedPassword));

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
  }, [debouncedPassword, passwordValue, isPasswordFocused]);

  const titleColor = useMemo(() => {
    const allRequirements = generalRequirements.concat(typeRequirements);
    if (allRequirements.every(requirement => requirement.isValid)) {
      return palette.green;
    }

    if (isFirstTimeFocused || passwordValue.length === 0) {
      return palette.neutral10;
    }

    return palette.error40;
  }, [generalRequirements, typeRequirements]);

  if (!show) {
    return null;
  }

  const getTitle = () => {
    if (
      generalRequirements
        .concat(typeRequirements)
        .every(requirement => requirement.isValid)
    ) {
      return t('password_requirements:requirements_met');
    }

    if (typeRequirements.every(requirement => requirement.isValid)) {
      return t('password_requirements:must_include_minimum');
    }

    return t('password_requirements:must_include');
  };

  return (
    <YStack mt={0} mx={10}>
      {<Text color={titleColor}>{getTitle()}</Text>}
      <PasswordRequirements
        generalRequirements={generalRequirements}
        typeRequirements={typeRequirements}
      />
    </YStack>
  );
};
