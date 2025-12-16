import { z } from 'zod';

export const MfaVerificationFormSchema = z.object({
  verificationCode: z
    .string()
    .min(1, 'form_item:required')
    .regex(/^[0-9]{6}$/, 'mfa_verification:invalid_code_format'),
});

export type MfaVerificationFormData = z.infer<
  typeof MfaVerificationFormSchema
>;
