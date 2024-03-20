import { z } from 'zod';

const schema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, 'password_recovery_form:password_at_least_characters')
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
    path: ['confirm'],
  });

export default schema;
