import { z } from 'zod';

import { LEGACY_PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import { noBlankSpaces } from '@app/shared/lib/utils/passwordValidation';

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'form_item:required'),
});
