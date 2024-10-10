import { z } from 'zod';

export const SignUpFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'form_item:required')
    .email('sign_up_form:email_looks_incomplete'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(6, 'password_requirements:at_least_characters')
    .refine(
      value => !value.includes(' '),
      'password_requirements:no_blank_spaces',
    ),
  firstName: z.string().trim().min(1, 'form_item:required'),
  lastName: z.string().trim().min(1, 'form_item:required'),
});

export type TSignUpForm = z.infer<typeof SignUpFormSchema>;
