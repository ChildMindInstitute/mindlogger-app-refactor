import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
  display_name: z.string().min(3),
  terms: z.literal(true),
});

export default schema;

export type TSignUpForm = z.infer<typeof schema>;
