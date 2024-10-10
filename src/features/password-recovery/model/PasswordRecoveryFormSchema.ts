import { t } from 'i18next';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';

export const PasswordRecoveryFormSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(
        PASSWORD_MIN_LENGTH,
        t('password_recovery_form:password_at_least_characters', {
          min: PASSWORD_MIN_LENGTH,
        }),
      )
      .refine(
        value => !value.includes(' '),
        'password_recovery_form:password_no_spaces',
      ),
    confirmPassword: z
      .string()
      .min(1, 'password_recovery_form:password_confirmation_required'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'password_recovery_form:passwords_do_not_match',
    path: ['confirmPassword'],
  });
