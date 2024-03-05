import { z } from 'zod';

const schema = z
  .object({
    new_password: z
      .string()
      .trim()
      .min(6, 'password_recovery_form:password_at_least_characters')
      .refine(
        value => !value.includes(' '),
        'password_recovery_form:password_no_spaces',
      ),
    confirm_password: z
      .string()
      .min(1, 'password_recovery_form:password_confirmation_required'),
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: 'password_recovery_form:passwords_do_not_match',
    path: ['confirm'],
  });

export default schema;
