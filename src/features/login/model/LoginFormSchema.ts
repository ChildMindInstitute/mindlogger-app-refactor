import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export default schema;

export type TLoginForm = z.infer<typeof schema>;
