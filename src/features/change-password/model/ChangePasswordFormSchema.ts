import { z } from 'zod';

const schema = z.object({
  prev_password: z
    .string()
    .min(1, 'form_item:required')
    .min(6, 'change_pass_form:password_at_least_characters'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(6, 'change_pass_form:password_at_least_characters')
    .refine(value => !value.includes(' '), 'sign_up_form:password_no_spaces'),
});

export default schema;
