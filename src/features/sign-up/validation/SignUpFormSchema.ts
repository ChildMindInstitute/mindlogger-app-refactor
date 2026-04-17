import { z } from 'zod';

import { passwordSuperRefine } from '@app/shared/lib/utils/passwordValidation';

export const SignUpFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'form_item:required')
    .email('sign_up_form:email_looks_incomplete'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .superRefine(passwordSuperRefine()),
  firstName: z.string().trim().min(1, 'form_item:required'),
  lastName: z.string().trim().min(1, 'form_item:required'),
});

export type TSignUpForm = z.infer<typeof SignUpFormSchema>;
