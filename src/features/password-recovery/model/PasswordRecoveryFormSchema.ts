import { t } from 'i18next';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import {
  checkPassword,
  noBlankSpaces,
  passwordCharacterTypesSuperRefine,
  PasswordErrorKey,
} from '@app/shared/lib/utils/passwordValidation';

export const PasswordRecoveryFormSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .refine(
        value => checkPassword(value).meetsLength,
        PasswordErrorKey.MIN_LENGTH,
      )
      .superRefine(passwordCharacterTypesSuperRefine())
      .refine(
        value => noBlankSpaces(value).isValid,
        PasswordErrorKey.NO_BLANK_SPACES,
      ),
    // No char-type validation needed - the passwords-must-match refine below
    // guarantees confirmPassword satisfies the same rules as newPassword.
    confirmPassword: z
      .string()
      .min(1, 'password_recovery_form:password_confirmation_required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'password_recovery_form:passwords_do_not_match',
    path: ['confirmPassword'],
  });
