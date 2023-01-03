import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Min length err'),
});

export default schema;

export type TLoginForm = z.infer<typeof schema>;
