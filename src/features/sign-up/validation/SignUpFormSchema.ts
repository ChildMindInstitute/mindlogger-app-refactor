import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import {
  PasswordErrorKey,
  checkPassword,
  noBlankSpaces,
  passwordCharacterTypesSuperRefine,
} from '@app/shared/lib/utils/passwordValidation';

export const SignUpFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'form_item:required')
    .email('sign_up_form:email_looks_incomplete'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .refine(
      value => checkPassword(value).meetsLength,
      PasswordErrorKey.MIN_LENGTH,
    )
    .superRefine(passwordCharacterTypesSuperRefine())
    .refine(
      value => noBlankSpaces(value).isValid,
      PasswordErrorKey.NO_BLANK_SPACES,
    ),
  firstName: z.string().trim().min(1, 'form_item:required'),
  lastName: z.string().trim().min(1, 'form_item:required'),
});

export type TSignUpForm = z.infer<typeof SignUpFormSchema>;
