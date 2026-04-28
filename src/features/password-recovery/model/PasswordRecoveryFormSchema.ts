import { z } from 'zod';

import { passwordSuperRefine } from '@app/shared/lib/utils/passwordValidation';

export const PasswordRecoveryFormSchema = z
  .object({
    newPassword: z.string().trim().superRefine(passwordSuperRefine()),
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
