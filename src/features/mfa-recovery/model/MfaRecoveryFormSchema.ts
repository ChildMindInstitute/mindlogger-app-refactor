import { z } from 'zod';

export const MfaRecoveryFormSchema = z.object({
  recoveryCode: z
    .string()
    .min(1, 'form_item:required')
    .regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/i, 'mfa_recovery:invalid_code_format'),
});

export type MfaRecoveryFormData = z.infer<typeof MfaRecoveryFormSchema>;
