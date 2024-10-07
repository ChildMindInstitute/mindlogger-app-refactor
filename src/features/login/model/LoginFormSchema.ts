import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(6, 'login:password_at_least_characters'),
});
