import { t } from 'i18next';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import {
  noBlankSpaces,
  passwordCharacterTypesSuperRefine,
  PasswordErrorKey,
} from '@app/shared/lib/utils/passwordValidation';

export const PasswordRecoveryFormSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(PASSWORD_MIN_LENGTH, t(PasswordErrorKey.MIN_LENGTH))
      .superRefine(passwordCharacterTypesSuperRefine())
      .refine(
        value => noBlankSpaces(value).isValid,
        PasswordErrorKey.NO_BLANK_SPACES,
      ),
    confirmPassword: z
      .string()
      .min(1, 'password_recovery_form:password_confirmation_required')
      .superRefine(passwordCharacterTypesSuperRefine()),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'password_recovery_form:passwords_do_not_match',
    path: ['confirmPassword'],
  });
