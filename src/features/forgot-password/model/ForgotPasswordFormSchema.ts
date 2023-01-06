import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export default schema;

export type TForgotPasswordForm = z.infer<typeof schema>;
