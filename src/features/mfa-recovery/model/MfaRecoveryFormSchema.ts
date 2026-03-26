import { z } from 'zod';

import { RECOVERY_CODE_LENGTH } from '@app/shared/lib/constants/mfa';

const RECOVERY_CODE_HALF = RECOVERY_CODE_LENGTH / 2;

export const MfaRecoveryFormSchema = z.object({
  recoveryCode: z
    .string()
    .min(1, 'form_item:required')
    .regex(
      new RegExp(
        `^[A-Z0-9]{${RECOVERY_CODE_HALF}}-[A-Z0-9]{${RECOVERY_CODE_HALF}}$`,
        'i',
      ),
      'mfa_recovery:invalid_code_format',
    ),
});

export type MfaRecoveryFormData = z.infer<typeof MfaRecoveryFormSchema>;
