import { z } from 'zod';

export const ForgotPasswordFormSchema = z.object({
  email: z.email(),
});

export type TForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>;
