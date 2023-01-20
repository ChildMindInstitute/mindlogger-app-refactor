import { z } from 'zod';

const schema = z.object({
  oldPassword: z.string().min(3),
  password: z.string().min(3),
});

export default schema;
