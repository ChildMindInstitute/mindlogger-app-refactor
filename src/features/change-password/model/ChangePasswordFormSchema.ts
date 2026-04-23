import { z } from 'zod';

import { passwordSuperRefine } from '@app/shared/lib/utils/passwordValidation';

export const ChangePasswordFormSchema = z.object({
  prev_password: z.string().min(1, 'form_item:required'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .superRefine(passwordSuperRefine()),
});
