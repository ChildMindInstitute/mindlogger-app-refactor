import { t } from 'i18next';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import {
  PasswordErrorKey,
  noBlankSpaces,
  passwordCharacterTypesSuperRefine,
} from '@app/shared/lib/utils/passwordValidation';

export const ChangePasswordFormSchema = z.object({
  prev_password: z
    .string()
    .min(1, 'form_item:required')
    .min(PASSWORD_MIN_LENGTH, PasswordErrorKey.MIN_LENGTH),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(PASSWORD_MIN_LENGTH, PasswordErrorKey.MIN_LENGTH)
    .superRefine(passwordCharacterTypesSuperRefine())
    .refine(value => noBlankSpaces(value).isValid, PasswordErrorKey.NO_BLANK_SPACES),
});
