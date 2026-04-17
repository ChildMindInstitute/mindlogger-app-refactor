import { z } from 'zod';

import { LEGACY_PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import { passwordSuperRefine } from '@app/shared/lib/utils/passwordValidation';

export const ChangePasswordFormSchema = z.object({
  prev_password: z
    .string()
    .min(1, 'form_item:required')
    .min(LEGACY_PASSWORD_MIN_LENGTH, 'login:password_at_least_characters'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .superRefine(passwordSuperRefine()),
});
