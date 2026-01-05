import { z } from 'zod';

import { TOTP_CODE_LENGTH } from '@app/shared/lib/constants/mfa';

export const MfaVerificationFormSchema = z.object({
  verificationCode: z
    .string()
    .min(1, 'form_item:required')
    .regex(
      new RegExp(`^[0-9]{${TOTP_CODE_LENGTH}}$`),
      'mfa_verification:invalid_code_format',
    ),
});

export type MfaVerificationFormData = z.infer<typeof MfaVerificationFormSchema>;
