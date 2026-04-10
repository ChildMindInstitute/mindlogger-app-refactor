import { z } from 'zod';

import {
  PASSWORD_MIN_LENGTH,
  LEGACY_PASSWORD_MIN_LENGTH,
} from '@app/shared/lib/constants/password';
import {
  PasswordErrorKey,
  checkPassword,
  noBlankSpaces,
  passwordCharacterTypesSuperRefine,
} from '@app/shared/lib/utils/passwordValidation';

export const ChangePasswordFormSchema = z.object({
  prev_password: z
    .string()
    .min(1, 'form_item:required')
    .min(LEGACY_PASSWORD_MIN_LENGTH, 'login:password_at_least_characters'),
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
});
